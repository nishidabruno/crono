import path from 'node:path'
import { Worker } from 'node:worker_threads'

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

// import z from 'zod'
import { auth } from '@/http/middlewares/auth'

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
          // security: [{ bearerAuth: [] }],
          consumes: ['multipart/form-data'],
          // response: {
          //   201: z.null(),
          // },
        },
      },
      async (request, reply) => {
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
        // const collection = await qdrantClientLangchain.addDocuments(docs)

        const maxBatchSize = 10 // Pages quantity by batch
        const batches = []
        for (let i = 0; i < docs.length; i += maxBatchSize) {
          batches.push(docs.slice(i, i + maxBatchSize))
        }

        const worker = new Worker(path.resolve(__dirname, './worker.js'), {
          workerData: { batches },
        })

        // Set up streaming response
        reply.raw.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          Connection: 'keep-alive',
        })

        worker.on('error', (error) => {
          console.error('Worker error:', error)
          reply.raw.write(
            `data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`,
          )
          reply.raw.end()
        })

        worker.on('message', (message) => {
          console.log(message)
          reply.raw.write(`${message}`)
        })

        worker.on('exit', () => {
          reply.raw.end()
        })

        request.raw.on('exit', () => {
          worker.terminate()
        })
      },
    )
}
