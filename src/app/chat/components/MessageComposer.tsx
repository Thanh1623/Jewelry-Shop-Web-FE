import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlusIcon, SendIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { uploadImageRequest } from "@/app/sale/services/upload.service"

import {
  sendMessageDefaultValues,
  sendMessageSchema,
  type SendMessageFormInput,
} from "../schemas/send-message.schema"
import { previewSaleTranslationRequest } from "../services/chat.service"

export interface ComposerSendPayload {
  content: string
  imageUrl?: string
}

interface MessageComposerProps {
  onSend: (payload: ComposerSendPayload) => void
  isSending: boolean
  disabled?: boolean
  draftContent?: string
  placeholder?: string
  /** Cho phép đính kèm ảnh (upload → URL). */
  allowImage?: boolean
  submitLabel?: string
  accentClassName?: string
  /** When set, live-preview translation to customer language while typing */
  translatePreviewSessionId?: string
  customerLocaleHint?: string | null
}

export function MessageComposer({
  onSend,
  isSending,
  disabled,
  draftContent,
  placeholder = "Nhập tin nhắn...",
  allowImage = false,
  accentClassName = "bg-teal-600 hover:bg-teal-700",
  translatePreviewSessionId,
  customerLocaleHint,
}: MessageComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [previewLocale, setPreviewLocale] = useState<string | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const form = useForm<SendMessageFormInput>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: sendMessageDefaultValues,
  })

  const content = useWatch({ control: form.control, name: "content" })

  useEffect(() => {
    if (draftContent === undefined) {
      return
    }
    form.setValue("content", draftContent, { shouldDirty: true, shouldValidate: true })
  }, [draftContent, form])

  useEffect(() => {
    if (!translatePreviewSessionId) {
      return
    }

    const text = content?.trim() ?? ""
    if (text.length < 2) {
      setPreview(null)
      setPreviewLocale(null)
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setIsPreviewing(true)
      try {
        const result = await previewSaleTranslationRequest(translatePreviewSessionId, text)
        if (cancelled) {
          return
        }
        setPreview(result.translatedText)
        setPreviewLocale(result.targetLocale)
      } catch {
        if (!cancelled) {
          setPreview(null)
        }
      } finally {
        if (!cancelled) {
          setIsPreviewing(false)
        }
      }
    }, 600)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [content, translatePreviewSessionId])

  async function handlePickImage(file: File | undefined) {
    if (!file) {
      return
    }
    if (file.size > 2_000_000) {
      toast.error("Ảnh tối đa 2MB.")
      return
    }

    setIsUploading(true)
    try {
      const { url } = await uploadImageRequest(file)
      setImageUrl(url)
      setImagePreview(url)
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Không tải được ảnh."))
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function clearImage() {
    setImageUrl(null)
    setImagePreview(null)
  }

  function onSubmit(values: SendMessageFormInput) {
    const trimmed = values.content.trim()
    if (!trimmed && !imageUrl) {
      form.setError("content", { message: "Nhập nội dung hoặc đính kèm ảnh." })
      return
    }

    onSend({
      content: trimmed || (imageUrl ? "[Ảnh đính kèm]" : ""),
      imageUrl: imageUrl ?? undefined,
    })
    form.reset()
    clearImage()
    setPreview(null)
    setPreviewLocale(null)
  }

  const busy = disabled || isSending || isUploading

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-1.5 border-t-0 p-2.5"
      >
        {imagePreview && (
          <div className="relative w-fit">
            <img
              src={imagePreview}
              alt="Xem trước"
              className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-800 text-white"
              aria-label="Gỡ ảnh"
            >
              <XIcon className="size-3" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-1.5">
          {allowImage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => void handlePickImage(event.target.files?.[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={busy}
                className="size-9 shrink-0 rounded-full border-slate-200"
                aria-label="Đính kèm ảnh"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlusIcon className="size-4" />
              </Button>
            </>
          )}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    disabled={busy}
                    className="min-h-[68px] resize-none rounded-xl border-slate-200 bg-slate-50/80 text-sm"
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        form.handleSubmit(onSubmit)()
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={busy}
            size="icon"
            className={`size-9 shrink-0 rounded-full ${accentClassName}`}
            aria-label="Gửi tin nhắn"
          >
            <SendIcon className="size-4" />
          </Button>
        </div>
        {translatePreviewSessionId && (preview || isPreviewing) && (
          <div className="rounded-xl border border-teal-100 bg-teal-50/60 px-2.5 py-1.5 text-[11px] text-slate-600">
            {isPreviewing && !preview ? (
              <span>Đang dịch xem trước…</span>
            ) : (
              <>
                <span className="font-medium text-slate-800">
                  Khách sẽ thấy
                  {previewLocale || customerLocaleHint
                    ? ` (${previewLocale ?? customerLocaleHint})`
                    : ""}
                  :{" "}
                </span>
                <span className="whitespace-pre-wrap">{preview}</span>
              </>
            )}
          </div>
        )}
      </form>
    </Form>
  )
}
