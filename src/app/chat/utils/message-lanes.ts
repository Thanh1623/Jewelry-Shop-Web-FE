import type { ChatMessage, MessageSender } from "../types/chat.types"

export type InternalLane = "AI" | "CRAFTSMAN"

/** Tin nhắn khách được thấy — không gồm AI/thợ nội bộ. */
export const CUSTOMER_VISIBLE_SENDERS: MessageSender[] = ["CUSTOMER", "SALE"]

export const SALE_CUSTOMER_LANE: MessageSender[] = ["CUSTOMER", "SALE"]
export const SALE_AI_LANE: MessageSender[] = ["AI", "SYSTEM"]
export const SALE_CRAFTSMAN_LANE: MessageSender[] = ["CRAFTSMAN"]

export function getInternalLane(message: ChatMessage): InternalLane | null {
  const lane = message.metaJson?.internalLane
  if (lane === "AI" || lane === "CRAFTSMAN") {
    return lane
  }
  return null
}

export function getMessageImageUrl(message: ChatMessage): string | null {
  const url = message.metaJson?.imageUrl
  return typeof url === "string" && url.length > 0 ? url : null
}

export function filterMessagesBySenders(
  messages: ChatMessage[],
  senders: MessageSender[]
): ChatMessage[] {
  const allowed = new Set(senders)
  return messages.filter((message) => allowed.has(message.sender))
}

/** Lọc theo 3 kênh sale — SALE hỏi AI/thợ gắn meta.internalLane. */
export function filterMessagesForSaleLane(
  messages: ChatMessage[],
  lane: "customer" | "ai" | "craftsman"
): ChatMessage[] {
  if (lane === "customer") {
    return messages.filter(
      (message) =>
        (message.sender === "CUSTOMER" || message.sender === "SALE") &&
        !getInternalLane(message)
    )
  }

  if (lane === "ai") {
    return messages.filter(
      (message) =>
        message.sender === "AI" ||
        message.sender === "SYSTEM" ||
        getInternalLane(message) === "AI"
    )
  }

  return messages.filter(
    (message) =>
      message.sender === "CRAFTSMAN" || getInternalLane(message) === "CRAFTSMAN"
  )
}

/** Khách chỉ thấy hội thoại public (không internalLane). */
export function filterCustomerVisibleMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter(
    (message) =>
      CUSTOMER_VISIBLE_SENDERS.includes(message.sender) && !getInternalLane(message)
  )
}
