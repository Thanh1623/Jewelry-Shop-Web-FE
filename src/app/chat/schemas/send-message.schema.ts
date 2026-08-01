import { z } from "zod"

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Nội dung tin nhắn không được để trống."),
})

export type SendMessageFormInput = z.input<typeof sendMessageSchema>
export type SendMessageFormValues = z.output<typeof sendMessageSchema>

export const sendMessageDefaultValues: SendMessageFormInput = {
  content: "",
}
