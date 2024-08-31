import { useState } from 'react'

export function useFileUpload() {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  async function uploadFile(file: File) {
    setIsFinished(false)
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:3333/rag/embed', {
        method: 'POST',
        headers: {
          'access-control-allow-origin': '*',
        },
        body: formData,
      })

      if (!response.body) {
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const read = await reader?.read()
        if (!read) break
        const { done, value } = read
        if (done) break

        const decodedValue = decoder.decode(value, { stream: true })
        setProgress(Number(decodedValue))
      }
    } catch (error) {
      console.error(error)
    }

    setIsUploading(false)
    setIsFinished(true)
  }

  return {
    uploadFile,
    progress,
    isUploading,
    isFinished,
  }
}
