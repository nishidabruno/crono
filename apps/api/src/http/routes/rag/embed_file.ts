import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { auth } from '@/http/middlewares/auth'
import { qdrantClientLangchain } from '@/lib/qdrant'

import { BadRequestError } from '../_errors/bad-request-error'

export async function embedFile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/rag/embed',
      {
        schema: {
          tags: ['rag'],
          summary: 'Embed a file.',
          security: [{ bearerAuth: [] }],
          consumes: ['multipart/form-data'],
        },
      },
      async (request, reply) => {
        // Authenticate
        await request.getCurrentUserId()

        const file = await request.file()
        if (!file) {
          throw new BadRequestError('No file uploaded.')
        }
        if (file.mimetype !== 'application/pdf') {
          throw new BadRequestError('Uploaded file must be a PDF.')
        }

        // Convert file to a blob.
        const buffer = await file.toBuffer()
        const blob = new Blob([buffer], { type: 'application/pdf' })

        // Load file and split into pages.
        const loader = new PDFLoader(blob)
        const pages = await loader.load()

        // Split text into chunks.
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 4000,
          chunkOverlap: 20,
        })
        const docs = await textSplitter.splitDocuments(pages)

        const maxBatchSize = 10 // Pages quantity by batch
        const batches = []
        for (let i = 0; i < docs.length; i += maxBatchSize) {
          batches.push(docs.slice(i, i + maxBatchSize))
        }

        let completedBatches = 0
        const totalBatches = batches.length

        // Set up streaming response
        reply.raw.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          Connection: 'keep-alive',
        })

        const promisses = batches.map(async (batch, index) => {
          try {
            await qdrantClientLangchain.addDocuments(batch)

            completedBatches++
            const progress = Math.round((completedBatches / totalBatches) * 100)
            reply.raw.write(`${progress}`)
          } catch (err) {
            console.error(`Error in batch ${index + 1}: ${err}`)
          }
        })

        await Promise.all(promisses)

        reply.raw.end()
      },
    )
}
