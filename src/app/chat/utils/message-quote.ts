import type { ChatMessage } from "../types/chat.types"

export interface QuoteMeta {
  productId: string
  productName?: string
  unitPrice: number
  quantity: number
  size?: number
  note?: string
}

export function getQuoteMeta(message: ChatMessage): QuoteMeta | null {
  const meta = message.metaJson
  if (
    !meta ||
    meta.type !== "quote" ||
    typeof meta.productId !== "string" ||
    typeof meta.unitPrice !== "number" ||
    typeof meta.quantity !== "number"
  ) {
    return null
  }

  return {
    productId: meta.productId,
    productName: typeof meta.productName === "string" ? meta.productName : undefined,
    unitPrice: meta.unitPrice,
    quantity: meta.quantity,
    size: typeof meta.size === "number" ? meta.size : undefined,
    note: typeof meta.note === "string" ? meta.note : undefined,
  }
}
