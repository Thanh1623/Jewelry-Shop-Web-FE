import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { SendIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import {
  sendMessageDefaultValues,
  sendMessageSchema,
  type SendMessageFormInput,
} from "../schemas/send-message.schema"
import { previewSaleTranslationRequest } from "../services/chat.service"

interface MessageComposerProps {
  onSend: (content: string) => void
  isSending: boolean
  disabled?: boolean
  draftContent?: string
  placeholder?: string
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
  translatePreviewSessionId,
  customerLocaleHint,
}: MessageComposerProps) {
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

  function onSubmit(values: SendMessageFormInput) {
    onSend(values.content)
    form.reset()
    setPreview(null)
    setPreviewLocale(null)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 border-t border-border/60 p-3"
      >
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    disabled={disabled}
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
          <Button type="submit" disabled={disabled || isSending} size="icon" aria-label="Gửi tin nhắn">
            <SendIcon />
          </Button>
        </div>
        {translatePreviewSessionId && (preview || isPreviewing) && (
          <div className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            {isPreviewing && !preview ? (
              <span>Đang dịch xem trước...</span>
            ) : (
              <>
                <span className="font-medium text-foreground">
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
