import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { chatKeys } from "@/app/chat/queries/chat.keys"
import {
  claimSessionRequest,
  releaseSessionRequest,
} from "@/app/chat/services/chat.service"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

export function useClaimSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: claimSessionRequest,
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
      toast.success(`Đã nhận phiên${session.sale ? ` · ${session.sale.fullName}` : ""}.`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không nhận được phiên."))
    },
  })
}

export function useReleaseSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: releaseSessionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.all })
      toast.success("Đã trả phiên về hàng đợi.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không trả được phiên."))
    },
  })
}
