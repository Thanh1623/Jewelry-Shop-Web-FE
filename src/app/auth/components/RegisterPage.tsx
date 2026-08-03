import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"

import { useRegisterMutation } from "@/app/auth/hooks/use-auth-mutations"
import {
  registerDefaultValues,
  registerSchema,
  type RegisterFormInput,
} from "@/app/auth/schemas/register.schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"

const fieldClass =
  "h-11 rounded-none border-[#0f1218]/15 bg-white/70 px-3 text-sm tracking-wide shadow-none focus-visible:border-[#0f1218]/45 focus-visible:ring-[#0f1218]/15"

export function RegisterPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get("productId")
  const registerMutation = useRegisterMutation()
  const loginHref = productId
    ? `${urlPaths.login}?productId=${productId}`
    : urlPaths.login

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: registerDefaultValues,
  })

  function onSubmit(values: RegisterFormInput) {
    registerMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    })
  }

  return (
    <div className="animate-fade-up">
      <p className="text-[11px] tracking-[0.32em] text-[#0f1218]/45 uppercase">
        Membership
      </p>
      <h1 className="mt-2 text-4xl font-light tracking-[0.08em] text-[#0f1218] sm:text-5xl">
        Đăng ký
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#0f1218]/55">
        {productId
          ? "Tạo tài khoản khách để hỏi giá và nhận tư vấn chế tác."
          : "Trở thành khách hàng Bạc Ý — tư vấn realtime và theo dõi đơn."}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-[11px] font-normal tracking-[0.2em] text-[#0f1218]/55 uppercase">
                  Họ tên
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-[11px] font-normal tracking-[0.2em] text-[#0f1218]/55 uppercase">
                  Số điện thoại
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    autoComplete="tel"
                    placeholder="0901234567"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-[11px] font-normal tracking-[0.2em] text-[#0f1218]/55 uppercase">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-[11px] font-normal tracking-[0.2em] text-[#0f1218]/55 uppercase">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className={fieldClass}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className={cn(
              "mt-2 h-12 rounded-none bg-[#0f1218] text-xs tracking-[0.22em] text-white uppercase",
              "hover:bg-[#0f1218]/90"
            )}
          >
            {registerMutation.isPending ? "Đang đăng ký..." : "Tạo tài khoản"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-sm text-[#0f1218]/55">
        Đã có tài khoản?{" "}
        <Link
          to={loginHref}
          className="tracking-wide text-[#0f1218] underline underline-offset-4 transition hover:opacity-70"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
