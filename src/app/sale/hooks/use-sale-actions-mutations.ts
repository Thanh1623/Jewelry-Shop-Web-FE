import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { askAdvisorRequest, askCraftsmanRequest } from "../services/sale-actions.service"

export function useAskAdvisorMutation(sessionId: string) {
  return useMutation({
    mutationFn: () => askAdvisorRequest(sessionId),
    onSuccess: () => {
      toast.success("Đã gửi câu hỏi cho AI Advisor.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể hỏi AI Advisor."))
    },
  })
}

export function useAskCraftsmanMutation(sessionId: string) {
  return useMutation({
    mutationFn: () => askCraftsmanRequest(sessionId),
    onSuccess: () => {
      toast.success("Đã gửi câu hỏi cho thợ chế tác.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể gửi yêu cầu cho thợ chế tác."))
    },
  })
}
