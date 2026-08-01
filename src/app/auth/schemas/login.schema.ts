import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc.").email("Email không hợp lệ."),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
})

export type LoginFormInput = z.input<typeof loginSchema>
export type LoginFormValues = z.output<typeof loginSchema>

export const loginDefaultValues: LoginFormInput = {
  email: "",
  password: "",
}
