import type { ChatMessage } from "@/app/chat/types/chat.types"

export interface PricingBreakdown {
  requestedSize: number
  baseSize: number
  weightGrams: number
  weightAdjustedGrams: number
  silverPricePerGram: number
  materialCost: number
  laborCost: number
  marginRate: number
  totalPrice: number
}

export interface AdvisorAskResponse {
  message: ChatMessage
  breakdown: PricingBreakdown
}

export type CraftsmanRequestStatus = "PENDING" | "SENT" | "ANSWERED" | "FAILED"

export interface AskCraftsmanPayload {
  sessionId: string
  question?: string
  customerNote?: string
  productImageUrl?: string
  referenceImageUrl?: string
}

export interface CraftsmanRequest {
  id: string
  sessionId: string
  productId: string | null
  question: string
  status: CraftsmanRequestStatus
  answer: string | null
  craftsmanName: string | null
  answeredAt: string | null
  externalError: string | null
  createdAt: string
  updatedAt: string
}
