import { zodResolver } from "@hookform/resolvers/zod"
import { HammerIcon, ImagePlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import type { ChatSessionDetail } from "@/app/chat/types/chat.types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { uploadImageRequest } from "../services/upload.service"
import type { AskCraftsmanPayload } from "../types/sale.types"

const askCraftsmanSchema = z.object({
  question: z.string().min(3, "Câu hỏi cần ít nhất 3 ký tự."),
  customerNote: z.string().optional(),
  referenceImageUrl: z.string().optional(),
})

type AskCraftsmanFormInput = z.infer<typeof askCraftsmanSchema>

interface AskCraftsmanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: ChatSessionDetail
  isSubmitting: boolean
  onSubmit: (payload: AskCraftsmanPayload) => void
}

function lastCustomerQuestion(session: ChatSessionDetail): string {
  const messages = [...session.messages].reverse()
  return messages.find((message) => message.sender === "CUSTOMER")?.content ?? ""
}

export function AskCraftsmanDialog({
  open,
  onOpenChange,
  session,
  isSubmitting,
  onSubmit,
}: AskCraftsmanDialogProps) {
  const [referencePreview, setReferencePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const product = session.product

  const form = useForm<AskCraftsmanFormInput>({
    resolver: zodResolver(askCraftsmanSchema),
    defaultValues: {
      question: "",
      customerNote: "",
      referenceImageUrl: "",
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    form.reset({
      question: lastCustomerQuestion(session),
      customerNote: "",
      referenceImageUrl: "",
    })
    setReferencePreview(null)
  }, [open, session, form])

  async function handleReferenceFile(file: File | undefined) {
    if (!file) {
      setReferencePreview(null)
      form.setValue("referenceImageUrl", "")
      return
    }
    if (file.size > 2_000_000) {
      form.setError("referenceImageUrl", {
        message: "Ảnh quá lớn (tối đa 2MB).",
      })
      return
    }

    setIsUploading(true)
    try {
      const { url } = await uploadImageRequest(file)
      setReferencePreview(url)
      form.setValue("referenceImageUrl", url, { shouldValidate: true })
    } catch (error) {
      form.setError("referenceImageUrl", {
        message: getApiErrorMessage(error, "Không tải được ảnh. Thử lại hoặc dán URL."),
      })
      toast.error("Upload ảnh thất bại")
    } finally {
      setIsUploading(false)
    }
  }

  function handleSubmit(values: AskCraftsmanFormInput) {
    onSubmit({
      sessionId: session.id,
      question: values.question.trim(),
      customerNote: values.customerNote?.trim() || undefined,
      productImageUrl: product?.imageUrl || undefined,
      referenceImageUrl: values.referenceImageUrl?.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-5 overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <HammerIcon className="size-5" />
          </div>
          <DialogTitle>Gửi yêu cầu cho thợ</DialogTitle>
          <DialogDescription>
            Form đầy đủ — câu hỏi, ghi chú và ảnh tham chiếu gửi sang xưởng.
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="flex gap-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-16 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white text-xs text-slate-500 ring-1 ring-slate-200">
                SP
              </div>
            )}
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-slate-800">{product.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {product.weightGrams}g · Công {product.laborCost.toLocaleString("vi-VN")}đ · Size{" "}
                {product.baseSize}
              </p>
              {product.description && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{product.description}</p>
              )}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-slate-600">Câu hỏi gửi thợ</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24 rounded-xl border-slate-200 bg-slate-50/60"
                      placeholder="Ví dụ: Size 6 có làm được không? Thời gian bao lâu?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerNote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-slate-600">
                    Ghi chú thêm <span className="font-normal text-slate-400">(tuỳ chọn)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 rounded-xl border-slate-200 bg-slate-50/60"
                      placeholder="Ví dụ: Khách muốn bản bóng gương, giao trước cuối tuần..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referenceImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-slate-600">
                    Ảnh tham chiếu <span className="font-normal text-slate-400">(tuỳ chọn)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="url"
                        placeholder="Dán URL ảnh…"
                        className="h-10 rounded-xl border-slate-200"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          setReferencePreview(event.target.value || null)
                          field.onChange(event.target.value)
                        }}
                      />
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs text-slate-600 transition hover:border-orange-200 hover:bg-orange-50/50">
                        <ImagePlusIcon className="size-4 text-orange-500" />
                        {isUploading ? "Đang tải ảnh…" : "Hoặc chọn ảnh từ máy"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={isUploading || isSubmitting}
                          onChange={(event) => {
                            void handleReferenceFile(event.target.files?.[0])
                          }}
                        />
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(referencePreview || product?.imageUrl) && (
              <div className="grid grid-cols-2 gap-2.5">
                {product?.imageUrl && (
                  <div className="overflow-hidden rounded-xl ring-1 ring-slate-200/80">
                    <p className="bg-slate-50 px-2.5 py-1 text-[10px] font-medium tracking-wide text-slate-500 uppercase">
                      Ảnh SP
                    </p>
                    <img
                      src={product.imageUrl}
                      alt="Sản phẩm"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                )}
                {referencePreview && (
                  <div className="overflow-hidden rounded-xl ring-1 ring-orange-100">
                    <p className="bg-orange-50 px-2.5 py-1 text-[10px] font-medium tracking-wide text-orange-700/80 uppercase">
                      Tham chiếu
                    </p>
                    <img
                      src={referencePreview}
                      alt="Tham chiếu"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 pt-1 sm:gap-2">
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
                disabled={isSubmitting || isUploading}
                className="h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600"
              >
                {isSubmitting ? "Đang gửi…" : "Gửi cho thợ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
