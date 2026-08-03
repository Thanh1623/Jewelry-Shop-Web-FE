import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"

import { useLoginMutation } from "@/app/auth/hooks/use-auth-mutations"
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormInput,
} from "@/app/auth/schemas/login.schema"
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

const showDemoHints = import.meta.env.DEV

const fieldClass =
  "h-11 rounded-none border-[#0f1218]/15 bg-white/70 px-3 text-sm tracking-wide shadow-none focus-visible:border-[#0f1218]/45 focus-visible:ring-[#0f1218]/15"

export function LoginPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get("productId")
  const loginMutation = useLoginMutation()
  const registerHref = productId
    ? `${urlPaths.register}?productId=${productId}`
    : urlPaths.register

  const form = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  })

  function onSubmit(values: LoginFormInput) {
    loginMutation.mutate(values)
  }

  return (
    <div className="animate-fade-up">
      <p className="text-[11px] tracking-[0.32em] text-[#0f1218]/45 uppercase">Welcome</p>
      <h1 className="mt-2 text-4xl font-light tracking-[0.08em] text-[#0f1218] sm:text-5xl">
        Đăng nhập
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#0f1218]/55">
        {productId
          ? "Tiếp tục để hỏi giá sản phẩm với chuyên viên Bạc Ý."
          : "Truy cập tài khoản để tư vấn realtime và theo dõi đơn hàng."}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex flex-col gap-5"
        >
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
                    autoComplete="current-password"
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
            disabled={loginMutation.isPending}
            className={cn(
              "mt-2 h-12 rounded-none bg-[#0f1218] text-xs tracking-[0.22em] text-white uppercase",
              "hover:bg-[#0f1218]/90"
            )}
          >
            {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-sm text-[#0f1218]/55">
        Chưa có tài khoản?{" "}
        <Link
          to={registerHref}
          className="tracking-wide text-[#0f1218] underline underline-offset-4 transition hover:opacity-70"
        >
          Đăng ký
        </Link>
      </p>

      {showDemoHints && (
        <div className="mt-8 space-y-1 border-t border-[#0f1218]/10 pt-5 text-[11px] leading-relaxed text-[#0f1218]/40">
          <p>Demo khách: customer@jewelry.local / Customer123456!</p>
          <p>Demo sale: sale@jewelry.local / Sale123456!</p>
          <p>Demo admin: admin@jewelry.local / Admin123456!</p>
        </div>
      )}
    </div>
  )
}
