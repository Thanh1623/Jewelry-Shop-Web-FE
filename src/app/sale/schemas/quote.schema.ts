import { z } from "zod"

export const quoteSchema = z.object({
  unitPrice: z.coerce.number().positive("Nhập giá hợp lệ."),
  quantity: z.coerce.number().int().min(1, "Số lượng tối thiểu 1."),
  size: z.coerce.number().int().positive().optional(),
})

export type QuoteFormInput = z.input<typeof quoteSchema>
export type QuoteFormValues = z.output<typeof quoteSchema>

export const quoteDefaultValues: QuoteFormInput = {
  unitPrice: 0,
  quantity: 1,
  size: undefined,
}
