import { StringOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOllama } from '@langchain/ollama'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { qdrantClientLangchain } from '@/lib/qdrant'

export async function chat(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/embed/search',
      {
        schema: {
          tags: ['rag'],
          summary: 'Search.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            question: z.string(),
          }),
        },
      },
      async (request, reply) => {
        // Authenticate
        await request.getCurrentUserId()

        const { question } = request.body

        const llm = new ChatOllama({ model: 'llama3.1', temperature: 0.3 })
        const prompt = PromptTemplate.fromTemplate(
          `
          [INST]<<SYS>>You are an assistant for question-answering tasks. Use the following retrieved context excerpts to answer the question. If you don't know the answer, just say you don't know. Keep the response concise. Always respond in the language in which the question was asked.<</SYS>>

          Question: {question}

          Context: {context}

          Answer: [/INST]
          `,
        )
        const ragChain = await createStuffDocumentsChain({
          llm,
          prompt,
          outputParser: new StringOutputParser(),
        })

        const retriever = qdrantClientLangchain.asRetriever({
          k: 3,
        })

        reply.raw.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        })

        const stream = await ragChain.stream({
          context: await retriever.invoke(question),
          question,
        })

        for await (const chunk of stream) {
          reply.raw.write(chunk)
        }

        reply.raw.end()
      },
    )
}
