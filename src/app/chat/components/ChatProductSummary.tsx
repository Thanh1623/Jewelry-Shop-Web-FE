import { useState } from "react"

import { formatVnd } from "@/app/product/utils/format-price"

import type { ChatSessionDetail } from "../types/chat.types"

interface ChatProductSummaryProps {
  session: ChatSessionDetail
}

export function ChatProductSummary({ session }: ChatProductSummaryProps) {
  const { product } = session
  const [imageFailed, setImageFailed] = useState(false)

  if (!product) {
    return (
      <p className="text-sm text-muted-foreground">
        Phiên trò chuyện của {session.guestName ?? "khách"} chưa gắn sản phẩm.
      </p>
    )
  }

  const showImage = Boolean(product.imageUrl) && !imageFailed

  return (
    <div className="flex items-center gap-3">
      {showImage ? (
        <img
          src={product.imageUrl!}
          alt={product.name}
          className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-border"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-[10px] font-medium text-slate-600 ring-1 ring-border">
          SP
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{product.name}</p>
        <p className="text-sm text-muted-foreground">
          {product.weightGrams}g · Công chế tác {formatVnd(product.laborCost)} ·{" "}
          {session.guestName ?? "Khách"}
        </p>
      </div>
    </div>
  )
}
