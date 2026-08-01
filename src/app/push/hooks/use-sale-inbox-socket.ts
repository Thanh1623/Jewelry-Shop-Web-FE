import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { chatKeys } from "@/app/chat/queries/chat.keys"
import { urlPaths } from "@/constants/urlPaths"
import { createSocket } from "@/lib/socket"

export interface SaleInboxPayload {
  kind: "customer_message" | "craftsman_reply" | "new_session"
  sessionId: string
  title: string
  body: string
}

/** Realtime toast + refresh queue for sale staff (even when not inside a session). */
export function useSaleInboxSocket(token: string | null | undefined): void {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      return
    }

    const socket = createSocket(token)

    socket.on("connect", () => {
      socket.emit("join_sales")
    })

    socket.on("sale_inbox", (payload: SaleInboxPayload) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.sessions() })
      toast(payload.title, {
        description: payload.body,
        action: {
          label: "Mở",
          onClick: () => navigate(urlPaths.saleSessionDetail(payload.sessionId)),
        },
      })

      if (typeof document !== "undefined" && document.hidden) {
        document.title = `(1) ${payload.title}`
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [token, queryClient, navigate])
}
