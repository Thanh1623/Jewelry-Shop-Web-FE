import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import type { MessageSender } from "../types/chat.types"

const SENDER_LABEL: Record<MessageSender, string> = {
  CUSTOMER: "Khách",
  SALE: "Bạn",
  AI: "AI",
  CRAFTSMAN: "Thợ",
  SYSTEM: "Hệ thống",
}

interface SenderBadgeProps {
  sender: MessageSender
  className?: string
}

export function SenderBadge({ sender, className }: SenderBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-4 rounded-full border-0 px-1.5 text-[9px] font-medium tracking-wide",
        sender === "CUSTOMER" && "bg-teal-100 text-teal-800",
        sender === "SALE" && "bg-slate-200 text-slate-700",
        sender === "AI" && "bg-violet-100 text-violet-800",
        sender === "CRAFTSMAN" && "bg-orange-100 text-orange-800",
        sender === "SYSTEM" && "bg-slate-100 text-slate-500",
        className
      )}
    >
      {SENDER_LABEL[sender]}
    </Badge>
  )
}
