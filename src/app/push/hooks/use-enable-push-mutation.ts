import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import {
  fetchVapidPublicKeyRequest,
  subscribePushRequest,
} from "../services/push.service"
import {
  arrayBufferToUrlBase64,
  urlBase64ToUint8Array,
} from "../utils/url-base64-to-uint8array"

async function enablePushNotifications(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    toast.error("Trình duyệt không hỗ trợ thông báo đẩy.")
    return false
  }

  const { publicKey } = await fetchVapidPublicKeyRequest()
  if (!publicKey) {
    toast.error("Chưa cấu hình VAPID.")
    return false
  }

  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    toast.error("Bạn đã từ chối quyền nhận thông báo.")
    return false
  }

  const registration = await navigator.serviceWorker.register("/sw.js")
  await navigator.serviceWorker.ready

  const existing = await registration.pushManager.getSubscription()
  if (existing) {
    await existing.unsubscribe().catch(() => undefined)
  }

  const applicationServerKey = urlBase64ToUint8Array(publicKey)
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey.buffer.slice(
      applicationServerKey.byteOffset,
      applicationServerKey.byteOffset + applicationServerKey.byteLength
    ) as ArrayBuffer,
  })

  const endpoint = subscription.endpoint
  const p256dhBuffer = subscription.getKey("p256dh")
  const authBuffer = subscription.getKey("auth")
  if (!endpoint || !p256dhBuffer || !authBuffer) {
    throw new Error("Trình duyệt không trả về khóa push hợp lệ.")
  }

  await subscribePushRequest({
    endpoint,
    keys: {
      p256dh: arrayBufferToUrlBase64(p256dhBuffer),
      auth: arrayBufferToUrlBase64(authBuffer),
    },
  })
  return true
}

export function useEnablePushMutation() {
  return useMutation({
    mutationFn: enablePushNotifications,
    onSuccess: (subscribed) => {
      if (subscribed) {
        toast.success("Đã bật thông báo cho sale.")
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể bật thông báo."))
    },
  })
}
