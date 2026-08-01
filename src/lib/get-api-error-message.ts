import { isAxiosError } from "axios"

import type { ApiErrorResponse } from "@/interfaces/api-error"

const DEFAULT_ERROR_MESSAGE = "Đã xảy ra lỗi. Vui lòng thử lại."

export function getApiErrorMessage(error: unknown, fallback = DEFAULT_ERROR_MESSAGE): string {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return fallback
  }

  const message = error.response?.data?.message

  if (Array.isArray(message)) {
    return message[0] ?? fallback
  }

  if (typeof message === "string" && message.length > 0) {
    return message
  }

  return fallback
}
