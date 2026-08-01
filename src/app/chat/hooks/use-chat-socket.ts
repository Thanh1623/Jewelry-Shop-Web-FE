import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

import { createSocket } from "@/lib/socket"

import { chatKeys } from "../queries/chat.keys"
import type { ChatMessage, ChatSessionDetail } from "../types/chat.types"
import { appendMessageToSession } from "../utils/append-message"

export interface CraftsmanRequestUpdatedPayload {
  requestId: string
  status: "PENDING" | "SENT" | "ANSWERED" | "FAILED"
  answer?: string | null
}

interface AdvisorResultPayload {
  sessionId: string
  source: "ai" | "craftsman"
  content: string
  message: ChatMessage
}

interface UseChatSocketOptions {
  sessionId: string | undefined
  token?: string | null
  onCraftsmanRequestUpdated?: (payload: CraftsmanRequestUpdatedPayload) => void
}

export function useChatSocket({
  sessionId,
  token,
  onCraftsmanRequestUpdated,
}: UseChatSocketOptions): void {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!sessionId) {
      return
    }

    const socket = createSocket(token)

    const appendToCache = (message: ChatMessage) => {
      queryClient.setQueryData(chatKeys.session(sessionId), (old: ChatSessionDetail | undefined) =>
        appendMessageToSession(old, message)
      )
    }

    socket.on("connect", () => {
      socket.emit("join_session", { sessionId })
    })
    socket.on("message_created", appendToCache)
    socket.on("advisor_result", (payload: AdvisorResultPayload) => {
      appendToCache(payload.message)
    })
    if (onCraftsmanRequestUpdated) {
      socket.on("craftsman_request_updated", onCraftsmanRequestUpdated)
    }

    return () => {
      socket.emit("leave_session", { sessionId })
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect only when session/token identity changes
  }, [sessionId, token, queryClient])
}
