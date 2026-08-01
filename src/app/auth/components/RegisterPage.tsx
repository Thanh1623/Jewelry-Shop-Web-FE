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
    <Card className="border-border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Đăng ký khách hàng</CardTitle>
        {productId && (
          <p className="text-xs text-muted-foreground">
            Tạo tài khoản để hỏi giá sản phẩm.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      autoComplete="tel"
                      placeholder="0901234567"
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
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>
        </Form>

        <p className="mt-3 text-xs text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link to={loginHref} className="text-foreground underline">
            Đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
