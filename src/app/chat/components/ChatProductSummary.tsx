import { useState } from "react"

import { formatVnd } from "@/app/product/utils/format-price"

import type { ChatSessionDetail } from "../types/chat.types"

interface ChatProductSummaryProps {
  session: ChatSessionDetail
}

export function ChatProductSummary({ session }: ChatProductSummaryProps) {
  const { product, customer } = session
  const [imageFailed, setImageFailed] = useState(false)
  const customerLabel =
    customer?.fullName ?? session.guestName ?? "Khách"
  const customerContact = [customer?.phone, customer?.email].filter(Boolean).join(" · ")

  if (!product) {
    return (
      <p className="text-sm text-muted-foreground">
        {customerLabel}
        {customerContact ? ` · ${customerContact}` : ""} · chưa gắn sản phẩm
      </p>
    )
  }

  const showImage = Boolean(product.imageUrl) && !imageFailed

  return (
    <div className="flex items-center gap-2">
      {showImage ? (
        <img
          src={product.imageUrl!}
          alt={product.name}
          className="size-10 shrink-0 object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="flex size-10 shrink-0 items-center justify-center bg-muted text-[10px]">
          SP
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {product.weightGrams}g · {formatVnd(product.laborCost)} · {customerLabel}
          {customer?.phone ? ` · ${customer.phone}` : ""}
        </p>
      </div>
    </div>
  )
}
