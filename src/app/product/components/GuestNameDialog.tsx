import { zodResolver } from "@hookform/resolvers/zod"
import { MessageCircleIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  guestNameDefaultValues,
  guestNameSchema,
  type GuestNameFormInput,
} from "../schemas/guest-name.schema"
import type { Product } from "../types/product.types"

interface GuestNameDialogProps {
  product: Product | null
  onOpenChange: (open: boolean) => void
  onConfirm: (guestName: string) => void
  isSubmitting: boolean
}

export function GuestNameDialog({
  product,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: GuestNameDialogProps) {
  const form = useForm<GuestNameFormInput>({
    resolver: zodResolver(guestNameSchema),
    defaultValues: guestNameDefaultValues,
  })

  function onSubmit(values: GuestNameFormInput) {
    onConfirm(values.guestName)
  }

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open) {
          form.reset(guestNameDefaultValues)
        }
        onOpenChange(open)
      }}
    >
      <DialogContent className="gap-5 sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <MessageCircleIcon className="size-5" />
          </div>
          <DialogTitle>Chat hỏi giá</DialogTitle>
          <DialogDescription>
            Nhập tên để bắt đầu trò chuyện với chuyên viên về sản phẩm này.
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt=""
                className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
              />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-xs text-slate-500">
                SP
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {product.weightGrams}g · Công {product.laborCost.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-slate-600">Tên của bạn</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="Ví dụ: Minh"
                      className="h-11 rounded-xl border-slate-200 bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-full border-slate-200"
                onClick={() => onOpenChange(false)}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-full bg-teal-600 hover:bg-teal-700"
              >
                {isSubmitting ? "Đang tạo…" : "Bắt đầu trò chuyện"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
