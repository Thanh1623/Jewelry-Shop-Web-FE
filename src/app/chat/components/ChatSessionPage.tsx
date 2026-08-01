import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    return <Skeleton className="h-96 w-full rounded-3xl" />
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Không tìm thấy phiên trò chuyện này.
      </p>
    )
  }

  const session = sessionQuery.data

  return (
    <Card className="mx-auto flex h-[75vh] max-w-2xl flex-col">
      <CardHeader className="border-b border-border/60 pb-4">
        <ChatProductSummary session={session} />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={session.messages} viewerRole="customer" />
        </div>
        <MessageComposer
          onSend={(content) => sendMessageMutation.mutate(content)}
          isSending={sendMessageMutation.isPending}
          disabled={!session.isOpen}
        />
      </CardContent>
    </Card>
  )
}
