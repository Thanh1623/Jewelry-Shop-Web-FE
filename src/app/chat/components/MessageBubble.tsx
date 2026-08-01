import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { ChatMessage, ChatViewerRole } from "../types/chat.types"
import { getMessageI18n } from "../utils/message-i18n"
import { SenderBadge } from "./SenderBadge"

interface MessageBubbleProps {
  message: ChatMessage
  viewerRole: ChatViewerRole
  onUseAsDraft?: (content: string) => void
}

const DRAFTABLE_SENDERS = new Set(["AI", "CRAFTSMAN"])

export function MessageBubble({
  message,
  viewerRole,
  onUseAsDraft,
}: MessageBubbleProps) {
  const isCustomer = message.sender === "CUSTOMER"
  const canDraft = Boolean(onUseAsDraft) && DRAFTABLE_SENDERS.has(message.sender)
  const i18n = getMessageI18n(message)
  const time = new Date(message.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const saleViewOfCustomer =
    viewerRole === "sale" && message.sender === "CUSTOMER" && i18n?.translatedText
  const saleViewOfOwnTranslated =
    viewerRole === "sale" && message.sender === "SALE" && i18n?.originalText
  const customerViewOfSale =
    viewerRole === "customer" && message.sender === "SALE" && i18n?.originalText

  return (
    <div className={cn("flex flex-col gap-1", isCustomer ? "items-start" : "items-end")}>
      <div className="flex items-center gap-2">
        {isCustomer && <SenderBadge sender={message.sender} />}
        <span className="text-xs text-muted-foreground">{time}</span>
        {!isCustomer && <SenderBadge sender={message.sender} />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap",
          isCustomer
            ? "bg-secondary text-secondary-foreground"
            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
        )}
      >
        {message.content}
        {saleViewOfCustomer && (
          <p className="mt-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Bản dịch ({i18n.targetLocale}): </span>
            {i18n.translatedText}
          </p>
        )}
        {saleViewOfOwnTranslated && (
          <p className="mt-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Bạn đã gõ: </span>
            {i18n.originalText}
          </p>
        )}
        {customerViewOfSale && (
          <p className="mt-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
            Tự động dịch sang ngôn ngữ của bạn
          </p>
        )}
      </div>
      {canDraft && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground"
          onClick={() => onUseAsDraft?.(message.content)}
        >
          Dùng làm bản nháp gửi khách
        </Button>
      )}
    </div>
  )
}
