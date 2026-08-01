import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type {
  ChatMessage,
  ChatSessionDetail,
  ChatSessionSummary,
  CreateQuotePayload,
  CreateSessionPayload,
  SendMessagePayload,
  TranslatePreviewResponse,
} from "../types/chat.types"

export async function createSessionRequest(
  payload: CreateSessionPayload
): Promise<ChatSessionDetail> {
  const { data } = await httpService.post<ChatSessionDetail>(
    apiPaths.chatSessions,
    payload
  )
  return data
}

export async function fetchSessionRequest(
  sessionId: string
): Promise<ChatSessionDetail> {
  const { data } = await httpService.get<ChatSessionDetail>(
    `${apiPaths.chatSessions}/${sessionId}`
  )
  return data
}

export async function fetchOpenSessionsRequest(): Promise<
  ChatSessionSummary[]
> {
  const { data } = await httpService.get<ChatSessionSummary[]>(
    apiPaths.chatSessions
  )
  return data
}

export async function claimSessionRequest(
  sessionId: string
): Promise<ChatSessionSummary> {
  const { data } = await httpService.post<ChatSessionSummary>(
    apiPaths.chatSessionClaim(sessionId)
  )
  return data
}

export async function releaseSessionRequest(
  sessionId: string
): Promise<ChatSessionSummary> {
  const { data } = await httpService.post<ChatSessionSummary>(
    apiPaths.chatSessionRelease(sessionId)
  )
  return data
}

export async function postMessageRequest(
  sessionId: string,
  payload: SendMessagePayload
): Promise<ChatMessage> {
  const { data } = await httpService.post<ChatMessage>(
    `${apiPaths.chatSessions}/${sessionId}/messages`,
    payload
  )
  return data
}

export async function createQuoteRequest(
  sessionId: string,
  payload: CreateQuotePayload
): Promise<ChatMessage> {
  const { data } = await httpService.post<ChatMessage>(
    apiPaths.chatSessionQuote(sessionId),
    payload
  )
  return data
}

export async function previewSaleTranslationRequest(
  sessionId: string,
  text: string
): Promise<TranslatePreviewResponse> {
  const { data } = await httpService.post<TranslatePreviewResponse>(
    apiPaths.chatTranslatePreview(sessionId),
    { text }
  )
  return data
}
