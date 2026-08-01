import type { Product } from "@/app/product/types/product.types"

export type MessageSender = "CUSTOMER" | "SALE" | "AI" | "CRAFTSMAN" | "SYSTEM"

export type ChatViewerRole = "customer" | "sale"

export interface MessageI18nMeta {
  sourceLocale: string
  targetLocale: string
  translatedText?: string
  originalText?: string
}

export interface ChatMessageMeta {
  i18n?: MessageI18nMeta
  internalLane?: "AI" | "CRAFTSMAN"
  imageUrl?: string
  type?: "quote"
  productId?: string
  productName?: string
  unitPrice?: number
  quantity?: number
  size?: number
  note?: string
  [key: string]: unknown
}

export interface ChatMessage {
  id: string
  sessionId: string
  senderId: string | null
  sender: MessageSender
  content: string
  metaJson: ChatMessageMeta | null
  createdAt: string
  updatedAt: string
}

export interface ChatSessionProductSummary {
  id: string
  name: string
  imageUrl: string | null
}

export interface ChatSessionCustomerSummary {
  id: string
  fullName: string
  email: string
  phone: string | null
}

export interface ChatSessionSaleSummary {
  id: string
  fullName: string
  email: string
}

export interface ChatSessionDetail {
  id: string
  productId: string | null
  customerId: string | null
  saleId: string | null
  guestName: string | null
  title: string | null
  customerLocale: string | null
  isOpen: boolean
  product: Product | null
  customer: ChatSessionCustomerSummary | null
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatSessionSummary {
  id: string
  title: string | null
  guestName: string | null
  customerId: string | null
  saleId: string | null
  isOpen: boolean
  product: ChatSessionProductSummary | null
  customer: ChatSessionCustomerSummary | null
  sale: ChatSessionSaleSummary | null
  lastMessage: Pick<ChatMessage, "id" | "sender" | "content" | "createdAt"> | null
  createdAt: string
  updatedAt: string
}

export interface CreateSessionPayload {
  productId?: string
  guestName?: string
}

export type HumanMessageSender = Extract<MessageSender, "CUSTOMER" | "SALE">

export interface SendMessagePayload {
  content: string
  sender: HumanMessageSender
  imageUrl?: string
}

export interface TranslatePreviewResponse {
  sourceLocale: string
  targetLocale: string
  translatedText: string
  customerLocale: string | null
}

export interface CreateQuotePayload {
  productId: string
  unitPrice: number
  quantity: number
  size?: number
  note?: string
}
