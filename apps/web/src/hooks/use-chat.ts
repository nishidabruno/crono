import { useState } from 'react'

interface Message {
  sender: 'user' | 'bot'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSending, setIsSending] = useState(false)

  async function sendMessage(userMessage: string) {
    setIsSending(true)
    setMessages((prev) => [...prev, { sender: 'user', content: userMessage }])

    const response = await fetch('http://localhost:3333/embed/search', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
      body: JSON.stringify({
        question: userMessage,
      }),
    })

    if (!response.body) {
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let botResponse = ''

    while (true) {
      const read = await reader?.read()
      if (!read) break
      const { done, value } = read
      if (done) break

      const decodedValue = decoder.decode(value, { stream: true })
      botResponse += decodedValue

      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].sender === 'bot') {
          return [...prev.slice(0, -1), { sender: 'bot', content: botResponse }]
        }
        return [...prev, { sender: 'bot', content: botResponse }]
      })
    }

    setIsSending(false)
  }

  return {
    messages,
    sendMessage,
    isSending,
  }
}
