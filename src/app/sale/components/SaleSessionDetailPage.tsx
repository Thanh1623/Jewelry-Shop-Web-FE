import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { ChatProductSummary } from "@/app/chat/components/ChatProductSummary"
import { useSendMessageMutation } from "@/app/chat/hooks/use-chat-mutations"
import { useChatSocket } from "@/app/chat/hooks/use-chat-socket"
import { MessageComposer } from "@/app/chat/components/MessageComposer"
import { MessageList } from "@/app/chat/components/MessageList"
import { chatSessionQueryOptions } from "@/app/chat/queries/chat.queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/stores/auth-store"

import { useAskAdvisorMutation, useAskCraftsmanMutation } from "../hooks/use-sale-actions-mutations"
import type { CraftsmanRequestStatus } from "../types/sale.types"

const CRAFTSMAN_STATUS_LABEL: Record<CraftsmanRequestStatus, string> = {
  PENDING: "Đang chờ gửi cho thợ chế tác...",
  SENT: "Đã gửi cho thợ, đang chờ phản hồi.",
  ANSWERED: "Thợ chế tác đã phản hồi.",
  FAILED: "Gửi yêu cầu cho thợ chế tác thất bại.",
}

export function SaleSessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [draftContent, setDraftContent] = useState("")
  const [draftNonce, setDraftNonce] = useState(0)
  const sessionQuery = useQuery(chatSessionQueryOptions(sessionId ?? ""))
  const sendMessageMutation = useSendMessageMutation(sessionId ?? "", "SALE")
  const askAdvisorMutation = useAskAdvisorMutation(sessionId ?? "")
  const askCraftsmanMutation = useAskCraftsmanMutation(sessionId ?? "")

  useChatSocket({
    sessionId,
    token: accessToken,
    onCraftsmanRequestUpdated: (payload) => {
      if (payload.status === "FAILED") {
        toast.error(CRAFTSMAN_STATUS_LABEL[payload.status])
        return
      }
      if (payload.status === "ANSWERED") {
        toast.success(CRAFTSMAN_STATUS_LABEL[payload.status])
        return
      }
      toast.info(CRAFTSMAN_STATUS_LABEL[payload.status])
    },
  })

  function handleUseAsDraft(content: string) {
    setDraftContent(content)
    setDraftNonce((value) => value + 1)
    toast.message("Đã đưa vào ô soạn thảo — chỉnh rồi gửi cho khách.")
  }

  if (sessionQuery.isPending) {
    return <Skeleton className="h-96 w-full rounded-3xl" />
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return <p className="text-sm text-muted-foreground">Không tìm thấy phiên trò chuyện này.</p>
  }

  const session = sessionQuery.data

  return (
    <Card className="flex h-[75vh] flex-col">
      <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <ChatProductSummary session={session} />
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => askAdvisorMutation.mutate()}
            disabled={askAdvisorMutation.isPending || !session.product}
          >
            {askAdvisorMutation.isPending ? "Đang hỏi AI..." : "Hỏi AI Advisor"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => askCraftsmanMutation.mutate()}
            disabled={askCraftsmanMutation.isPending}
          >
            {askCraftsmanMutation.isPending ? "Đang gửi..." : "Hỏi thợ"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={session.messages}
            viewerRole="sale"
            onUseAsDraft={handleUseAsDraft}
          />
        </div>
        <MessageComposer
          key={draftNonce}
          draftContent={draftContent}
          placeholder="Soạn / chỉnh câu trả lời gửi khách..."
          translatePreviewSessionId={sessionId}
          customerLocaleHint={session.customerLocale}
          onSend={(content) => sendMessageMutation.mutate(content)}
          isSending={sendMessageMutation.isPending}
        />
      </CardContent>
    </Card>
  )
}
