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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const showDemoHints = import.meta.env.DEV

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
    <Card className="border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Đăng nhập</CardTitle>
        {productId && (
          <p className="text-xs text-muted-foreground">
            Đăng nhập để hỏi giá sản phẩm.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>

        <p className="mt-3 text-xs text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link to={registerHref} className="text-foreground underline">
            Đăng ký
          </Link>
        </p>

        {showDemoHints && (
          <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
            <p>Demo khách: customer@jewelry.local / Customer123456!</p>
            <p>Demo sale: sale@jewelry.local / Sale123456!</p>
            <p>Demo admin: admin@jewelry.local / Admin123456!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
