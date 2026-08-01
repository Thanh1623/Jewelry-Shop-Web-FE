import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type {
  AdvisorAskResponse,
  AskCraftsmanPayload,
  CraftsmanRequest,
} from "../types/sale.types"

export async function askAdvisorRequest(
  sessionId: string,
  options?: { question?: string; messageId?: string; imageUrl?: string }
): Promise<AdvisorAskResponse> {
  const { data } = await httpService.post<AdvisorAskResponse>(apiPaths.advisorAsk, {
    sessionId,
    question: options?.question,
    messageId: options?.messageId,
    imageUrl: options?.imageUrl,
  })
  return data
}

export async function askCraftsmanRequest(
  payload: AskCraftsmanPayload
): Promise<CraftsmanRequest> {
  const { data } = await httpService.post<CraftsmanRequest>(apiPaths.craftsmanAsk, payload)
  return data
}
