import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useEnablePushMutation } from "../hooks/use-enable-push-mutation"

export function PushSubscribeButton() {
  const enablePushMutation = useEnablePushMutation()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-7 rounded-full border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50"
      onClick={() => enablePushMutation.mutate()}
      disabled={enablePushMutation.isPending}
    >
      <Bell className="size-3.5" />
      {enablePushMutation.isPending ? "Đang bật..." : "Bật thông báo"}
    </Button>
  )
}
