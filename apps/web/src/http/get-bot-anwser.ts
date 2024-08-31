import { api } from './api-client'

interface GetBotAnswerRequest {
  question: string
}

interface GetBotAnswerResponse {
  data: string[]
}

export async function getBotAnswer(
  { question }: GetBotAnswerRequest,
  setter: (prev: string) => void,
) {
  const result = await api
    .post('embed/search', {
      json: {
        question,
      },
      hooks: {
        afterResponse: [
          async (response) => {
            const reader = response.body?.getReader()
            const decoder = new TextDecoder()
            while (true) {
              const { done, value: chunk } = await reader?.read()
              if (done) break

              const decoedValue = decoder.decode(chunk)
              setter((prev: string) => prev + decoedValue)
            }
          },
        ],
      },
    })
    .json<GetBotAnswerResponse>()

  return result
}
