import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import type { MessageSender } from "../types/chat.types"

const SENDER_LABEL: Record<MessageSender, string> = {
  CUSTOMER: "Khách hàng",
  SALE: "Nhân viên",
  AI: "AI Advisor",
  CRAFTSMAN: "Thợ chế tác",
  SYSTEM: "Hệ thống",
}

const SENDER_CLASSNAME: Record<MessageSender, string> = {
  CUSTOMER: "",
  SALE: "bg-slate-700 text-white dark:bg-slate-600",
  AI: "bg-sky-700 text-white dark:bg-sky-600",
  CRAFTSMAN: "bg-zinc-600 text-white dark:bg-zinc-500",
  SYSTEM: "",
}

interface SenderBadgeProps {
  sender: MessageSender
  className?: string
}

export function SenderBadge({ sender, className }: SenderBadgeProps) {
  const variant = sender === "CUSTOMER" ? "secondary" : sender === "SYSTEM" ? "outline" : "default"

  return (
    <Badge variant={variant} className={cn(SENDER_CLASSNAME[sender], className)}>
      {SENDER_LABEL[sender]}
    </Badge>
  )
}
