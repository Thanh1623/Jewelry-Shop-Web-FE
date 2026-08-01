import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { Skeleton } from "@/components/ui/skeleton"

import { useChatSocket } from "../hooks/use-chat-socket"
import { useSendMessageMutation } from "../hooks/use-chat-mutations"
import { chatSessionQueryOptions } from "../queries/chat.queries"
import { ChatProductSummary } from "./ChatProductSummary"
import { MessageComposer } from "./MessageComposer"
import { MessageList } from "./MessageList"

export function ChatSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const sessionQuery = useQuery(chatSessionQueryOptions(sessionId ?? ""))
  const sendMessageMutation = useSendMessageMutation(sessionId ?? "", "CUSTOMER")

  useChatSocket({ sessionId })

  if (sessionQuery.isPending) {
    return <Skeleton className="h-[70vh] w-full" />
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return <p className="text-sm text-muted-foreground">Không tìm thấy phiên chat.</p>
  }

  const session = sessionQuery.data

  return (
    <div className="mx-auto flex h-[70vh] max-w-2xl flex-col overflow-hidden border border-border bg-card">
      <div className="border-b border-border px-3 py-2">
        <ChatProductSummary session={session} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={session.messages} viewerRole="customer" />
        </div>
        <MessageComposer
          onSend={(content) => sendMessageMutation.mutate(content)}
          isSending={sendMessageMutation.isPending}
          disabled={!session.isOpen}
        />
      </div>
    </div>
  )
}
