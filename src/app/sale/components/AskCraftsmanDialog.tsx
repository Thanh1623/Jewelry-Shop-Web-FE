import { zodResolver } from "@hookform/resolvers/zod"
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gửi yêu cầu cho thợ</DialogTitle>
          <DialogDescription>Câu hỏi, ghi chú và ảnh tham chiếu (nếu có).</DialogDescription>
        </DialogHeader>

        {product && (
          <div className="flex gap-3 border border-border bg-muted/40 p-3">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-20 shrink-0 object-cover"
              />
            ) : (
              <div className="metal-sheen flex size-20 shrink-0 items-center justify-center text-xs text-slate-600">
                SP
              </div>
            )}
            <div className="min-w-0 text-sm">
              <p className="font-medium">{product.name}</p>
              <p className="text-muted-foreground">
                {product.weightGrams}g · Công {product.laborCost.toLocaleString("vi-VN")}đ · Size{" "}
                {product.baseSize}
              </p>
              <p className="mt-1 line-clamp-2 text-muted-foreground">{product.description}</p>
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
                  <FormLabel>Câu hỏi gửi thợ</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
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
                  <FormLabel>Mô tả / ghi chú thêm (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20"
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
                  <FormLabel>Ảnh tham chiếu (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <Input
                        type="url"
                        placeholder="Dán URL ảnh tham chiếu..."
                        value={field.value ?? ""}
                        onChange={(event) => {
                          setReferencePreview(event.target.value || null)
                          field.onChange(event.target.value)
                        }}
                      />
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isUploading || isSubmitting}
                        onChange={(event) => {
                          void handleReferenceFile(event.target.files?.[0])
                        }}
                      />
                      {isUploading && (
                        <p className="text-xs text-muted-foreground">Đang tải ảnh lên server...</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(referencePreview || product?.imageUrl) && (
              <div className="grid grid-cols-2 gap-2">
                {product?.imageUrl && (
                  <div className="overflow-hidden border border-border">
                    <p className="bg-muted px-2 py-1 text-[11px] text-muted-foreground">Ảnh SP</p>
                    <img src={product.imageUrl} alt="Sản phẩm" className="aspect-square w-full object-cover" />
                  </div>
                )}
                {referencePreview && (
                  <div className="overflow-hidden border border-border">
                    <p className="bg-muted px-2 py-1 text-[11px] text-muted-foreground">Tham chiếu</p>
                    <img
                      src={referencePreview}
                      alt="Tham chiếu"
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Đang gửi..." : "Gửi cho thợ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
