import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { chatKeys } from "@/app/chat/queries/chat.keys"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { askAdvisorRequest, askCraftsmanRequest } from "../services/sale-actions.service"
import type { AskCraftsmanPayload } from "../types/sale.types"

export function useAskAdvisorMutation(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload?: { question?: string; imageUrl?: string }) =>
      askAdvisorRequest(sessionId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatKeys.session(sessionId) })
      toast.success("AI đã trả lời trong khung AI.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể hỏi AI Advisor."))
    },
  })
}

export function useAskCraftsmanMutation(sessionId?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AskCraftsmanPayload) => askCraftsmanRequest(payload),
    onSuccess: async (_data, variables) => {
      const id = sessionId ?? variables.sessionId
      await queryClient.invalidateQueries({ queryKey: chatKeys.session(id) })
      toast.success("Đã gửi câu hỏi cho thợ chế tác.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể gửi yêu cầu cho thợ chế tác."))
    },
  })
}
