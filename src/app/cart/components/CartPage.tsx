import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"

import { formatVnd } from "@/app/product/utils/format-price"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

import {
  useCheckoutMutation,
  useRemoveCartItemMutation,
  useUpdateCartQuantityMutation,
} from "../hooks/use-cart-mutations"
import { cartQueryOptions } from "../queries/cart.queries"

export function CartPage() {
  const user = useAuthStore((s) => s.user)
  const enabled = user?.role === "CUSTOMER" || user?.role === "ADMIN"
  const cartQuery = useQuery(cartQueryOptions(enabled))
  const updateQty = useUpdateCartQuantityMutation()
  const removeItem = useRemoveCartItemMutation()
  const checkout = useCheckoutMutation()
  const [shippingName, setShippingName] = useState("")
  const [shippingPhone, setShippingPhone] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")

  if (!enabled) {
    return (
      <p className="text-sm text-muted-foreground">
        Đăng nhập tài khoản khách để dùng giỏ hàng.{" "}
        <Link to={urlPaths.login} className="underline">
          Đăng nhập
        </Link>
      </p>
    )
  }

  const cart = cartQuery.data

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Cart</p>
        <h1 className="mt-1 text-2xl font-light tracking-wide">Giỏ hàng</h1>
      </div>

      {cartQuery.isPending && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-none" />
          ))}
        </div>
      )}

      {cartQuery.isError && (
        <p className="text-sm text-destructive">Không tải được giỏ hàng.</p>
      )}

      {cart && cart.items.length === 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Giỏ trống.</p>
          <Button className="rounded-none" asChild variant="outline">
            <Link to={urlPaths.home}>Xem bộ sưu tập</Link>
          </Button>
        </div>
      )}

      {cart && cart.items.length > 0 && (
        <>
          <ul className="divide-y divide-border border border-border">
            {cart.items.map((line) => (
              <li key={line.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="size-20 shrink-0 overflow-hidden bg-muted">
                  {line.product.imageUrl ? (
                    <img
                      src={line.product.imageUrl}
                      alt={line.product.name}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm tracking-wide">{line.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatVnd(line.unitPrice)} · {line.product.weightGrams}g
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-none p-0"
                    disabled={updateQty.isPending || line.quantity <= 1}
                    onClick={() =>
                      updateQty.mutate({ itemId: line.id, quantity: line.quantity - 1 })
                    }
                  >
                    −
                  </Button>
                  <span className="w-6 text-center text-sm">{line.quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-none p-0"
                    disabled={updateQty.isPending}
                    onClick={() =>
                      updateQty.mutate({ itemId: line.id, quantity: line.quantity + 1 })
                    }
                  >
                    +
                  </Button>
                </div>
                <p className="w-28 text-sm sm:text-right">{formatVnd(line.lineTotal)}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-none text-xs text-muted-foreground"
                  disabled={removeItem.isPending}
                  onClick={() => removeItem.mutate(line.id)}
                >
                  Xóa
                </Button>
              </li>
            ))}
          </ul>

          <div className="space-y-3 border border-border p-4">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Giao hàng (tùy chọn)
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="shippingName" className="text-xs">
                  Người nhận
                </Label>
                <Input
                  id="shippingName"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shippingPhone" className="text-xs">
                  SĐT
                </Label>
                <Input
                  id="shippingPhone"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="rounded-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shippingAddress" className="text-xs">
                  Địa chỉ
                </Label>
                <Input
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="rounded-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{cart.itemCount} sản phẩm</p>
              <p className="text-lg tracking-wide">Tổng {formatVnd(cart.totalAmount)}</p>
            </div>
            <Button
              className="rounded-none"
              disabled={checkout.isPending}
              onClick={() =>
                checkout.mutate({
                  shippingName: shippingName.trim() || undefined,
                  shippingPhone: shippingPhone.trim() || undefined,
                  shippingAddress: shippingAddress.trim() || undefined,
                })
              }
            >
              {checkout.isPending ? "Đang tạo đơn..." : "Thanh toán demo"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
