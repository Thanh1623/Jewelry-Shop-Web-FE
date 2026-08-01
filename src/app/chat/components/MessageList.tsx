import { useEffect, useRef } from "react"

import type { ChatMessage, ChatViewerRole, MessageSender } from "../types/chat.types"
import {
  filterCustomerVisibleMessages,
  filterMessagesBySenders,
  filterMessagesForSaleLane,
} from "../utils/message-lanes"
import { MessageBubble } from "./MessageBubble"

interface MessageListProps {
  messages: ChatMessage[]
  viewerRole: ChatViewerRole
  senders?: MessageSender[]
  /** Sale 3-lane filter (ưu tiên hơn senders). */
  saleLane?: "customer" | "ai" | "craftsman"
  /** Customer FE: ẩn tin nội bộ AI/thợ. */
  customerVisibleOnly?: boolean
  onUseAsDraft?: (content: string) => void
  onAcceptQuote?: (messageId: string) => void
  isAcceptingQuote?: boolean
  emptyText?: string
}

export function MessageList({
  messages,
  viewerRole,
  senders,
  saleLane,
  customerVisibleOnly,
  onUseAsDraft,
  onAcceptQuote,
  isAcceptingQuote,
  emptyText = "Chưa có tin nhắn.",
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  const visible = saleLane
    ? filterMessagesForSaleLane(messages, saleLane)
    : customerVisibleOnly
      ? filterCustomerVisibleMessages(messages)
      : senders
        ? filterMessagesBySenders(messages, senders)
        : messages

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [visible.length])

  if (visible.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-muted-foreground">{emptyText}</p>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 overflow-y-auto p-3">
      {visible.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          viewerRole={viewerRole}
          onUseAsDraft={onUseAsDraft}
          onAcceptQuote={onAcceptQuote}
          isAcceptingQuote={isAcceptingQuote}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
