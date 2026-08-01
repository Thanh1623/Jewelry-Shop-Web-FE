import { z } from "zod"

export const guestNameSchema = z.object({
  guestName: z.string().min(1, "Vui lòng nhập tên của bạn."),
})

export type GuestNameFormInput = z.input<typeof guestNameSchema>
export type GuestNameFormValues = z.output<typeof guestNameSchema>

export const guestNameDefaultValues: GuestNameFormInput = {
  guestName: "Khách",
}
