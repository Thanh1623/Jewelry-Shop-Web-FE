import type { ReactNode } from "react"
import { EyeOffIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LaneAccent = "customer" | "ai" | "craftsman"

interface SaleChatLaneProps {
  title: string
  subtitle: string
  visibility: "public" | "internal"
  accent: LaneAccent
  headerRight?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
  onHide?: () => void
}

const ACCENT_TOP: Record<LaneAccent, string> = {
  customer: "border-t-teal-400/80",
  ai: "border-t-violet-400/80",
  craftsman: "border-t-orange-300/90",
}

const ACCENT_SOFT: Record<LaneAccent, string> = {
  customer: "bg-teal-50/50",
  ai: "bg-violet-50/50",
  craftsman: "bg-orange-50/40",
}

const VISIBILITY_LABEL = {
  public: "Công khai",
  internal: "Nội bộ",
} as const

export function SaleChatLane({
  title,
  subtitle,
  visibility,
  accent,
  headerRight,
  footer,
  children,
  className,
  onHide,
}: SaleChatLaneProps) {
  return (
    <section
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm border-t-[3px]",
        ACCENT_TOP[accent],
        className
      )}
    >
      <header
        className={cn(
          "flex shrink-0 items-start justify-between gap-2 border-b border-black/5 px-3.5 py-3",
          ACCENT_SOFT[accent]
        )}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
            <Badge
              variant="outline"
              className={cn(
                "h-5 rounded-full border-0 px-2 text-[10px] font-medium",
                visibility === "public"
                  ? "bg-teal-100/80 text-teal-800"
                  : "bg-slate-200/70 text-slate-600"
              )}
            >
              {VISIBILITY_LABEL[visibility]}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">{subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {headerRight}
          {onHide && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 rounded-full px-2 text-[11px] text-slate-500 hover:bg-white/80 hover:text-slate-700"
              onClick={onHide}
              title={`Ẩn ${title}`}
            >
              <EyeOffIcon className="size-3.5" />
              Ẩn
            </Button>
          )}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-white">
        {children}
      </div>
      {footer && (
        <div className="shrink-0 border-t border-black/5 bg-white/90 backdrop-blur-sm">
          {footer}
        </div>
      )}
    </section>
  )
}
