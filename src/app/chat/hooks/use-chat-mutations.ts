import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { urlPaths } from "@/constants/urlPaths"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { createQuoteRequest, createSessionRequest, postMessageRequest } from "../services/chat.service"
import type {
  ChatSessionDetail,
  CreateQuotePayload,
  CreateSessionPayload,
  HumanMessageSender,
  SendMessagePayload,
} from "../types/chat.types"
import { appendMessageToSession } from "../utils/append-message"
import { chatKeys } from "../queries/chat.keys"

export function useCreateSessionMutation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSessionRequest(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(chatKeys.session(session.id), session)
      navigate(urlPaths.chatSession(session.id))
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể bắt đầu trò chuyện."))
    },
  })
}

export function useSendMessageMutation(sessionId: string, sender: HumanMessageSender) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Pick<SendMessagePayload, "content" | "imageUrl">) =>
      postMessageRequest(sessionId, { ...payload, sender }),
    onSuccess: (message) => {
      queryClient.setQueryData(chatKeys.session(sessionId), (old: ChatSessionDetail | undefined) =>
        appendMessageToSession(old, message)
      )
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể gửi tin nhắn."))
    },
  })
}

export function useCreateQuoteMutation(sessionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateQuotePayload) => createQuoteRequest(sessionId, payload),
    onSuccess: (message) => {
      queryClient.setQueryData(chatKeys.session(sessionId), (old: ChatSessionDetail | undefined) =>
        appendMessageToSession(old, message)
      )
      toast.success("Đã gửi báo giá cho khách.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể gửi báo giá."))
    },
  })
}
