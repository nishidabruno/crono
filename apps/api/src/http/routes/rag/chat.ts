import { StringOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOllama } from '@langchain/ollama'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
// import { JsonOutputFunctionsParser } from 'langchain/output_parsers'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
// import { chromaClientLangchain } from '@/lib/chroma'
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
          // security: [{ bearerAuth: [] }],
          body: z.object({
            question: z.string(),
          }),
          // response: {
          //   200: z.object({
          //     answer: z.string(),
          //   }),
          // },
        },
      },
      async (request, reply) => {
        const { question } = request.body

        // Chain
        const llm = new ChatOllama({ model: 'llama3.1', temperature: 0.3 })
        // const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt-llama')
        const prompt = PromptTemplate.fromTemplate(
          `
          [INST]<<SYS>> Você é um assistente para tarefas de resposta a perguntas. Use os seguintes trechos de contexto recuperado para responder à pergunta. Se você não souber a resposta, apenas diga que não sabe. Mantenha a resposta concisa. Sempre me responda na língua em que foi perguntado.<</SYS>>

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

        // const chain = await prompt
        //   .pipe(llm)
        //   .pipe(new JsonOutputFunctionsParser({ diff: true }))

        // const retriever = chromaClientLangchain.asRetriever({
        //   k: 3,
        // })

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
