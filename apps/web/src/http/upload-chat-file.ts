import { api } from './api-client'

export async function uploadChatFile(formData: FormData) {
  const result = await api.post('rag/embed', {
    body: formData,
  })

  return result
}
