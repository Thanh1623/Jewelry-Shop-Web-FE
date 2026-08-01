import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

import { ChatProductSummary } from "@/app/chat/components/ChatProductSummary"
import { useSendMessageMutation } from "@/app/chat/hooks/use-chat-mutations"
import { useChatSocket } from "@/app/chat/hooks/use-chat-socket"
import { MessageComposer } from "@/app/chat/components/MessageComposer"
import { MessageList } from "@/app/chat/components/MessageList"
import { chatSessionQueryOptions } from "@/app/chat/queries/chat.queries"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

import { useAskAdvisorMutation, useAskCraftsmanMutation } from "../hooks/use-sale-actions-mutations"
import type { CraftsmanRequestStatus } from "../types/sale.types"
import { AskCraftsmanDialog } from "./AskCraftsmanDialog"

const CRAFTSMAN_STATUS_LABEL: Record<CraftsmanRequestStatus, string> = {
  PENDING: "Đang gửi thợ...",
  SENT: "Đã gửi thợ, chờ phản hồi.",
  ANSWERED: "Thợ đã phản hồi.",
  FAILED: "Gửi thợ thất bại.",
}

export function SaleSessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [draftContent, setDraftContent] = useState("")
  const [draftNonce, setDraftNonce] = useState(0)
  const [askCraftsmanOpen, setAskCraftsmanOpen] = useState(false)
  const sessionQuery = useQuery(chatSessionQueryOptions(sessionId ?? ""))
  const sendMessageMutation = useSendMessageMutation(sessionId ?? "", "SALE")
  const askAdvisorMutation = useAskAdvisorMutation(sessionId ?? "")
  const askCraftsmanMutation = useAskCraftsmanMutation()

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
    toast.message("Đã đưa vào ô soạn thảo.")
  }

  if (sessionQuery.isPending) {
    return <Skeleton className="h-[70vh] w-full" />
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return <p className="text-sm text-muted-foreground">Không tìm thấy phiên.</p>
  }

  const session = sessionQuery.data

  return (
    <>
      <div className="mb-2">
        <Button asChild variant="ghost" size="sm" className="h-7 px-0 text-xs">
          <Link to={urlPaths.saleDashboard}>← Danh sách</Link>
        </Button>
      </div>

      <div className="flex h-[70vh] flex-col overflow-hidden border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2">
          <ChatProductSummary session={session} />
          <div className="flex shrink-0 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => askAdvisorMutation.mutate()}
              disabled={askAdvisorMutation.isPending || !session.product}
            >
              {askAdvisorMutation.isPending ? "AI..." : "Hỏi AI"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setAskCraftsmanOpen(true)}
              disabled={askCraftsmanMutation.isPending}
            >
              Hỏi thợ
            </Button>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
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
            placeholder="Soạn trả lời gửi khách..."
            translatePreviewSessionId={sessionId}
            customerLocaleHint={session.customerLocale}
            onSend={(content) => sendMessageMutation.mutate(content)}
            isSending={sendMessageMutation.isPending}
          />
        </div>
      </div>

      <AskCraftsmanDialog
        open={askCraftsmanOpen}
        onOpenChange={setAskCraftsmanOpen}
        session={session}
        isSubmitting={askCraftsmanMutation.isPending}
        onSubmit={(payload) => {
          askCraftsmanMutation.mutate(payload, {
            onSuccess: () => setAskCraftsmanOpen(false),
          })
        }}
      />
    </>
  )
}
