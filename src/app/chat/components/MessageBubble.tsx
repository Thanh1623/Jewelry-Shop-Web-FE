import { formatVnd } from "@/app/product/utils/format-price"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { ChatMessage, ChatViewerRole } from "../types/chat.types"
import { getMessageI18n } from "../utils/message-i18n"
import { getInternalLane, getMessageImageUrl } from "../utils/message-lanes"
import { getQuoteMeta } from "../utils/message-quote"
import { SenderBadge } from "./SenderBadge"

interface MessageBubbleProps {
  message: ChatMessage
  viewerRole: ChatViewerRole
  onUseAsDraft?: (content: string) => void
  onAcceptQuote?: (messageId: string) => void
  isAcceptingQuote?: boolean
}

const DRAFTABLE_SENDERS = new Set(["AI", "CRAFTSMAN"])

export function MessageBubble({
  message,
  viewerRole,
  onUseAsDraft,
  onAcceptQuote,
  isAcceptingQuote,
}: MessageBubbleProps) {
  const isCustomer = message.sender === "CUSTOMER"
  const isInternalReply = message.sender === "AI" || message.sender === "CRAFTSMAN"
  const internalLane = getInternalLane(message)
  const isInternalAsk = message.sender === "SALE" && Boolean(internalLane)
  const alignStart = isCustomer || isInternalReply
  const canDraft = Boolean(onUseAsDraft) && DRAFTABLE_SENDERS.has(message.sender)
  const imageUrl = getMessageImageUrl(message)
  const i18n = getMessageI18n(message)
  const quote = getQuoteMeta(message)
  const time = new Date(message.createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const saleViewOfCustomer =
    viewerRole === "sale" && message.sender === "CUSTOMER" && i18n?.translatedText
  const saleViewOfOwnTranslated =
    viewerRole === "sale" && message.sender === "SALE" && !internalLane && i18n?.originalText
  const customerViewOfSale =
    viewerRole === "customer" && message.sender === "SALE" && i18n?.originalText

  const showContent =
    message.content && message.content !== "[Ảnh đính kèm]"

  return (
    <div className={cn("flex flex-col gap-1", alignStart ? "items-start" : "items-end")}>
      <div className="flex items-center gap-1.5">
        {alignStart && <SenderBadge sender={message.sender} />}
        {isInternalAsk && (
          <span className="text-[10px] font-medium text-slate-500">
            Bạn → {internalLane === "AI" ? "AI" : "Thợ"}
          </span>
        )}
        <span className="text-[10px] tabular-nums text-slate-400">{time}</span>
        {!alignStart && !isInternalAsk && <SenderBadge sender={message.sender} />}
      </div>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
          isCustomer && "border border-teal-100 bg-white text-slate-800",
          message.sender === "SALE" &&
            !isInternalAsk &&
            "bg-slate-700 text-white shadow-slate-700/10",
          isInternalAsk &&
            internalLane === "AI" &&
            "bg-violet-600 text-white shadow-violet-600/15",
          isInternalAsk &&
            internalLane === "CRAFTSMAN" &&
            "bg-orange-500 text-white shadow-orange-500/15",
          message.sender === "AI" && "border border-violet-100 bg-violet-50 text-slate-800",
          message.sender === "CRAFTSMAN" &&
            "border border-orange-100 bg-orange-50 text-slate-800",
          message.sender === "SYSTEM" &&
            "border border-dashed border-slate-200 bg-slate-50 text-slate-500"
        )}
      >
        {imageUrl && (
          <a href={imageUrl} target="_blank" rel="noreferrer" className="mb-2 block">
            <img
              src={imageUrl}
              alt="Đính kèm"
              className="max-h-48 w-full rounded-xl object-cover ring-1 ring-black/5"
            />
          </a>
        )}
        {showContent && <p className="whitespace-pre-wrap">{message.content}</p>}
        {quote && (
          <div
            className={cn(
              "mt-2 space-y-1 rounded-xl border px-3 py-2 text-xs",
              isCustomer || message.sender === "SALE"
                ? "border-white/20 bg-black/10"
                : "border-teal-100 bg-teal-50/60 text-slate-700"
            )}
          >
            <p className="font-medium">Báo giá{quote.productName ? ` · ${quote.productName}` : ""}</p>
            <p>
              {formatVnd(quote.unitPrice)} × {quote.quantity}
              {quote.size ? ` · Size ${quote.size}` : ""}
            </p>
            <p className="font-semibold">Tổng {formatVnd(quote.unitPrice * quote.quantity)}</p>
            {quote.note && <p className="opacity-80">{quote.note}</p>}
          </div>
        )}
        {saleViewOfCustomer && (
          <p className="mt-2 border-t border-teal-100 pt-2 text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">Dịch ({i18n.targetLocale}): </span>
            {i18n.translatedText}
          </p>
        )}
        {saleViewOfOwnTranslated && (
          <p className="mt-2 border-t border-white/15 pt-2 text-[11px] text-white/70">
            <span className="font-medium text-white">Bạn gõ: </span>
            {i18n.originalText}
          </p>
        )}
        {customerViewOfSale && (
          <p className="mt-2 border-t border-white/15 pt-2 text-[11px] text-white/70">
            Đã tự động dịch
          </p>
        )}
      </div>
      {canDraft && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 rounded-full border-slate-200 bg-white px-2.5 text-[10px] text-slate-600 hover:bg-teal-50 hover:text-teal-800"
          onClick={() => onUseAsDraft?.(message.content)}
        >
          Chuyển sang kênh Khách
        </Button>
      )}
      {quote && viewerRole === "customer" && onAcceptQuote && (
        <Button
          type="button"
          size="sm"
          className="h-7 rounded-full bg-teal-600 px-3 text-[11px] hover:bg-teal-700"
          disabled={isAcceptingQuote}
          onClick={() => onAcceptQuote(message.id)}
        >
          {isAcceptingQuote ? "Đang xử lý..." : "Đồng ý & thanh toán"}
        </Button>
      )}
    </div>
  )
}
