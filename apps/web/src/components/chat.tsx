'use client'

import { Paperclip } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'

import { useChat } from '@/hooks/use-chat'
import { useFileUpload } from '@/hooks/use-file-upload'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'

export function Chat() {
  const chatInputRef = useRef<HTMLInputElement>(null)
  const { messages, sendMessage, isSending } = useChat()

  const [file, setFile] = useState<File | null>(null)
  const { uploadFile, progress, isUploading, isFinished } = useFileUpload()

  // const scrollRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (chatInputRef.current) {
      const message = chatInputRef.current.value
      chatInputRef.current.value = ''

      await sendMessage(message)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  async function handleFileUpload() {
    if (file) {
      uploadFile(file)
    }

    if (isFinished) {
      setFile(null)
    }
  }

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     scrollRef.current.scrollIntoView({ block: 'end' })
  //   }
  // }, [messages])

  return (
    <div className="mt-4 w-full">
      <h1 className="text-3xl font-medium">Chat AI</h1>
      <p className="text-muted-foreground">RAG chat AI</p>

      <div className="flex gap-4">
        <div className="mt-4 flex w-[240px] flex-col rounded-md border border-border p-4">
          <h2 className="text-lg font-bold">History</h2>

          <div className="mt-2">
            {/* <Button className="w-full justify-start" variant="ghost">
              Current chat...
            </Button> */}
            <p className="sm text-muted-foreground">No recent chats.</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col justify-between rounded-md border border-border p-4">
          <ScrollArea className="h-[700px] w-[1050px]">
            <div className="flex flex-col space-y-4 pr-8">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback />
                </Avatar>

                <p className="leading-relaxed">
                  <span className="block text-sm font-bold">Bot</span>
                  Hello, how can I help you?
                </p>
              </div>

              {messages.map((message, index) =>
                message.sender === 'bot' ? (
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback />
                    </Avatar>
                    <p key={index} className="leading-relaxed">
                      <span className="block text-sm font-bold">Bot</span>
                      {message.content}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start justify-end gap-3">
                    <p key={index} className="space-y-1 leading-relaxed">
                      <span className="flex justify-end text-sm font-bold">
                        You
                      </span>
                      <span className="flex rounded-lg bg-muted p-2 px-4">
                        {message.content}
                      </span>
                    </p>
                    <Avatar>
                      <AvatarImage src="https://github.com/nishidabruno.png" />
                      <AvatarFallback />
                    </Avatar>
                  </div>
                ),
              )}
            </div>

            {messages[messages.length - 1]?.sender === 'user' && (
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback />
                </Avatar>

                <div className="flex flex-1 flex-col space-y-2">
                  <span className="block text-sm font-bold">Bot</span>
                  <Skeleton className="h-[24px] w-2/3" />
                  <Skeleton className="h-[24px] w-3/5" />
                </div>
              </div>
            )}
          </ScrollArea>

          <form className="mt-auto flex gap-2 pt-4" onSubmit={handleSubmit}>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Paperclip className="size-4" />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload file</DialogTitle>
                  <DialogDescription>
                    Upload files to add context to the bot.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <div className="space-y-2">
                    <span>Progress:</span>
                    <Progress value={isUploading ? progress : 0} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleFileUpload} disabled={isUploading}>
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Input
              name="chat-message"
              className="flex-1"
              placeholder="How can I help you?"
              ref={chatInputRef}
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
