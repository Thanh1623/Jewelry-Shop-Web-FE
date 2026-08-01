import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeftIcon,
  BotIcon,
  EyeIcon,
  HammerIcon,
  SendIcon,
  UserIcon,
} from "lucide-react"
import { toast } from "sonner"

import { MessageComposer } from "@/app/chat/components/MessageComposer"
import { MessageList } from "@/app/chat/components/MessageList"
import { useSendMessageMutation } from "@/app/chat/hooks/use-chat-mutations"
import { useChatSocket } from "@/app/chat/hooks/use-chat-socket"
import { chatSessionQueryOptions } from "@/app/chat/queries/chat.queries"
import { formatVnd } from "@/app/product/utils/format-price"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

import { useAskAdvisorMutation, useAskCraftsmanMutation } from "../hooks/use-sale-actions-mutations"
import type { CraftsmanRequestStatus } from "../types/sale.types"
import { AskCraftsmanDialog } from "./AskCraftsmanDialog"
import { SaleChatLane } from "./SaleChatLane"

const CRAFTSMAN_STATUS_LABEL: Record<CraftsmanRequestStatus, string> = {
  PENDING: "Đang gửi thợ...",
  SENT: "Đã gửi thợ, chờ phản hồi.",
  ANSWERED: "Thợ đã phản hồi — xem kênh Thợ.",
  FAILED: "Gửi thợ thất bại.",
}

type LaneKey = "customer" | "ai" | "craftsman"

const LANE_META: Record<
  LaneKey,
  { label: string; icon: typeof UserIcon; activeClass: string; idleClass: string }
> = {
  customer: {
    label: "Khách",
    icon: UserIcon,
    activeClass: "bg-teal-600 text-white shadow-sm shadow-teal-600/20",
    idleClass: "bg-white text-slate-600 ring-1 ring-slate-200/80 hover:bg-teal-50",
  },
  ai: {
    label: "AI",
    icon: BotIcon,
    activeClass: "bg-violet-500 text-white shadow-sm shadow-violet-500/20",
    idleClass: "bg-white text-slate-600 ring-1 ring-slate-200/80 hover:bg-violet-50",
  },
  craftsman: {
    label: "Thợ",
    icon: HammerIcon,
    activeClass: "bg-orange-400 text-white shadow-sm shadow-orange-400/25",
    idleClass: "bg-white text-slate-600 ring-1 ring-slate-200/80 hover:bg-orange-50",
  },
}

export function SaleSessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [draftContent, setDraftContent] = useState("")
  const [draftNonce, setDraftNonce] = useState(0)
  const [askCraftsmanOpen, setAskCraftsmanOpen] = useState(false)
  const [mobileLane, setMobileLane] = useState<LaneKey>("customer")
  const [visibleLanes, setVisibleLanes] = useState<Record<LaneKey, boolean>>({
    customer: true,
    ai: true,
    craftsman: true,
  })

  const sessionQuery = useQuery(chatSessionQueryOptions(sessionId ?? ""))
  const sendMessageMutation = useSendMessageMutation(sessionId ?? "", "SALE")
  const askAdvisorMutation = useAskAdvisorMutation(sessionId ?? "")
  const askCraftsmanMutation = useAskCraftsmanMutation(sessionId)

  useChatSocket({
    sessionId,
    token: accessToken,
    onCraftsmanRequestUpdated: (payload) => {
      if (payload.status === "FAILED") {
        toast.error(CRAFTSMAN_STATUS_LABEL[payload.status])
        return
      }
      if (payload.status === "ANSWERED") {
        toast.success(CRAFTSMAN_STATUS_LABEL[payload.status])
        setVisibleLanes((prev) => ({ ...prev, craftsman: true }))
        setMobileLane("craftsman")
        return
      }
      toast.info(CRAFTSMAN_STATUS_LABEL[payload.status])
    },
  })

  const desktopVisibleCount = useMemo(
    () => (Object.values(visibleLanes) as boolean[]).filter(Boolean).length,
    [visibleLanes]
  )

  function toggleLane(key: LaneKey) {
    setVisibleLanes((prev) => {
      const currentlyOn = prev[key]
      if (currentlyOn) {
        const remaining = (Object.values(prev) as boolean[]).filter(Boolean).length
        if (remaining <= 1) {
          toast.message("Giữ ít nhất một kênh đang hiện.")
          return prev
        }
      }
      return { ...prev, [key]: !currentlyOn }
    })
    setMobileLane(key)
  }

  function handleUseAsDraft(content: string) {
    setDraftContent(content)
    setDraftNonce((value) => value + 1)
    setVisibleLanes((prev) => ({ ...prev, customer: true }))
    setMobileLane("customer")
    toast.message("Đã chuyển sang kênh Khách — chỉnh rồi gửi.")
  }

  if (sessionQuery.isPending) {
    return (
      <div className="flex h-full flex-col gap-3 p-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="min-h-0 flex-1 w-full rounded-2xl" />
      </div>
    )
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Không tìm thấy phiên.</p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link to={urlPaths.saleDashboard}>Về hàng đợi</Link>
        </Button>
      </div>
    )
  }

  const session = sessionQuery.data
  const customerName = session.customer?.fullName ?? session.guestName ?? "Khách"
  const customerMeta = [session.customer?.phone, session.customer?.email]
    .filter(Boolean)
    .join(" · ")
  const product = session.product

  const customerLane = (
    <SaleChatLane
      title="Khách hàng"
      subtitle="Tin ở đây mới hiện với khách"
      visibility="public"
      accent="customer"
      onHide={() => toggleLane("customer")}
      footer={
        <MessageComposer
          key={draftNonce}
          allowImage
          draftContent={draftContent}
          placeholder="Soạn trả lời gửi khách..."
          translatePreviewSessionId={sessionId}
          customerLocaleHint={session.customerLocale}
          onSend={(payload) =>
            sendMessageMutation.mutate({
              content: payload.content,
              imageUrl: payload.imageUrl,
            })
          }
          isSending={sendMessageMutation.isPending}
        />
      }
    >
      <MessageList
        messages={session.messages}
        viewerRole="sale"
        saleLane="customer"
        emptyText="Chưa có hội thoại với khách."
      />
    </SaleChatLane>
  )

  const aiLane = (
    <SaleChatLane
      title="AI Advisor"
      subtitle="Chat nội bộ · chỉ sale thấy"
      visibility="internal"
      accent="ai"
      onHide={() => toggleLane("ai")}
      footer={
        <MessageComposer
          allowImage
          placeholder="Hỏi AI… (có thể kèm ảnh)"
          accentClassName="bg-violet-500 hover:bg-violet-600"
          disabled={!product}
          isSending={askAdvisorMutation.isPending}
          onSend={(payload) =>
            askAdvisorMutation.mutate({
              question: payload.content === "[Ảnh đính kèm]" ? undefined : payload.content,
              imageUrl: payload.imageUrl,
            })
          }
        />
      }
    >
      <MessageList
        messages={session.messages}
        viewerRole="sale"
        saleLane="ai"
        onUseAsDraft={handleUseAsDraft}
        emptyText="Chưa có hội thoại với AI. Gõ câu hỏi ở dưới."
      />
    </SaleChatLane>
  )

  const craftsmanLane = (
    <SaleChatLane
      title="Thợ chế tác"
      subtitle="Chat nội bộ · webhook xưởng"
      visibility="internal"
      accent="craftsman"
      onHide={() => toggleLane("craftsman")}
      headerRight={
        <Button
          variant="outline"
          size="sm"
          className="h-7 shrink-0 rounded-full border-orange-200 bg-white text-xs text-orange-700 hover:bg-orange-50"
          onClick={() => setAskCraftsmanOpen(true)}
          disabled={askCraftsmanMutation.isPending}
        >
          Form đầy đủ
        </Button>
      }
      footer={
        <MessageComposer
          allowImage
          placeholder="Hỏi thợ… (có thể kèm ảnh tham chiếu)"
          accentClassName="bg-orange-500 hover:bg-orange-600"
          isSending={askCraftsmanMutation.isPending}
          onSend={(payload) =>
            askCraftsmanMutation.mutate({
              sessionId: session.id,
              question:
                payload.content === "[Ảnh đính kèm]" ? "Xem ảnh đính kèm" : payload.content,
              productImageUrl: product?.imageUrl || undefined,
              referenceImageUrl: payload.imageUrl,
            })
          }
        />
      }
    >
      <MessageList
        messages={session.messages}
        viewerRole="sale"
        saleLane="craftsman"
        onUseAsDraft={handleUseAsDraft}
        emptyText="Chưa có hội thoại với thợ. Gõ câu hỏi ở dưới."
      />
    </SaleChatLane>
  )

  const lanes = {
    customer: customerLane,
    ai: aiLane,
    craftsman: craftsmanLane,
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200/70 bg-white/70 px-3 py-2.5 backdrop-blur-md sm:px-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-full px-2.5 text-xs text-slate-600 hover:bg-slate-100"
        >
          <Link to={urlPaths.saleDashboard}>
            <ArrowLeftIcon className="size-3.5" />
            Hàng đợi
          </Link>
        </Button>
        <div className="hidden h-5 w-px bg-slate-200 sm:block" />

        <div className="flex min-w-0 flex-1 items-center gap-3">
          {product?.imageUrl ? (
            <img
              src={product.imageUrl}
              alt=""
              className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <UserIcon className="size-4 text-slate-400" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {customerName}
              <span className="font-normal text-slate-500">
                {" "}
                · {product?.name ?? "Chưa gắn SP"}
              </span>
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {customerMeta || "Không có SĐT/email"}
              {product
                ? ` · ${product.weightGrams}g · Công ${formatVnd(product.laborCost)}`
                : ""}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-1.5 lg:flex">
          <span className="mr-1 text-[11px] text-slate-400">Hiện kênh</span>
          {(Object.keys(LANE_META) as LaneKey[]).map((key) => {
            const meta = LANE_META[key]
            const Icon = meta.icon
            const isOn = visibleLanes[key]
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleLane(key)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition",
                  isOn ? meta.activeClass : meta.idleClass
                )}
                title={isOn ? `Ẩn ${meta.label}` : `Hiện ${meta.label}`}
              >
                {isOn ? <EyeIcon className="size-3.5" /> : <Icon className="size-3.5" />}
                {meta.label}
              </button>
            )
          })}
        </div>

        <span className="hidden items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] text-teal-700 xl:inline-flex">
          <SendIcon className="size-3" /> Chỉ kênh Khách gửi ra ngoài
        </span>
      </div>

      <div className="flex shrink-0 gap-2 border-b border-slate-200/70 bg-white/60 px-3 py-2 lg:hidden">
        {(Object.keys(LANE_META) as LaneKey[]).map((key) => {
          const meta = LANE_META[key]
          const Icon = meta.icon
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setVisibleLanes((prev) => ({ ...prev, [key]: true }))
                setMobileLane(key)
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium transition",
                mobileLane === key ? meta.activeClass : meta.idleClass
              )}
            >
              <Icon className="size-3.5" />
              {meta.label}
            </button>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 p-2.5 sm:p-3">
        <div className="flex h-full flex-col lg:hidden">{lanes[mobileLane]}</div>

        <div
          className={cn(
            "hidden h-full gap-3 lg:grid",
            desktopVisibleCount === 1 && "lg:grid-cols-1",
            desktopVisibleCount === 2 && "lg:grid-cols-2",
            desktopVisibleCount >= 3 && "lg:grid-cols-3"
          )}
        >
          {visibleLanes.customer && customerLane}
          {visibleLanes.ai && aiLane}
          {visibleLanes.craftsman && craftsmanLane}
        </div>
      </div>

      <AskCraftsmanDialog
        open={askCraftsmanOpen}
        onOpenChange={setAskCraftsmanOpen}
        session={session}
        isSubmitting={askCraftsmanMutation.isPending}
        onSubmit={(payload) => {
          askCraftsmanMutation.mutate(payload, {
            onSuccess: () => setAskCraftsmanOpen(false),
          })
        }}
      />
    </div>
  )
}
