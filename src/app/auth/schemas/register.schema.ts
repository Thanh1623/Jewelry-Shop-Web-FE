import { z } from "zod"

export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự."),
  email: z.string().min(1, "Email là bắt buộc.").email("Email không hợp lệ."),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
})

export type RegisterFormInput = z.input<typeof registerSchema>
export type RegisterFormValues = z.output<typeof registerSchema>

export const registerDefaultValues: RegisterFormInput = {
  fullName: "",
  email: "",
  password: "",
}
