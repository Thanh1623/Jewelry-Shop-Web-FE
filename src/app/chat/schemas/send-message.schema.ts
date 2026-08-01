import { z } from "zod"

// ponytail: allow empty text when an image is attached (validated in composer)
export const sendMessageSchema = z.object({
  content: z.string(),
})

export type SendMessageFormInput = z.input<typeof sendMessageSchema>
export type SendMessageFormValues = z.output<typeof sendMessageSchema>

export const sendMessageDefaultValues: SendMessageFormInput = {
  content: "",
}
