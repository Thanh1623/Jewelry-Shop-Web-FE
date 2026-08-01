import { useEffect, useRef } from "react"

import type { ChatMessage, ChatViewerRole } from "../types/chat.types"
import { MessageBubble } from "./MessageBubble"

interface MessageListProps {
  messages: ChatMessage[]
  viewerRole: ChatViewerRole
  onUseAsDraft?: (content: string) => void
}

export function MessageList({ messages, viewerRole, onUseAsDraft }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          viewerRole={viewerRole}
          onUseAsDraft={onUseAsDraft}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
