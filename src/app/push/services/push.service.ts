import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type {
  PushSubscribePayload,
  VapidPublicKeyResponse,
} from "../types/push.types"

export async function fetchVapidPublicKeyRequest(): Promise<VapidPublicKeyResponse> {
  const { data } = await httpService.get<VapidPublicKeyResponse>(
    apiPaths.pushVapidPublicKey
  )
  return data
}

export async function subscribePushRequest(
  payload: PushSubscribePayload
): Promise<void> {
  await httpService.post(apiPaths.pushSubscribe, payload)
}
