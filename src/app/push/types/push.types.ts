export interface PushSubscribePayload {
  endpoint: string
  keys: { p256dh: string; auth: string }
}

export interface VapidPublicKeyResponse {
  publicKey: string
}
