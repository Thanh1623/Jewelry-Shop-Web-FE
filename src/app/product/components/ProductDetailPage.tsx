import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"

import { useUpsertCartItemMutation } from "@/app/cart/hooks/use-cart-mutations"
import { useCreateSessionMutation } from "@/app/chat/hooks/use-chat-mutations"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

import { productDetailQueryOptions } from "../queries/product.queries"
import { formatVnd } from "../utils/format-price"

export function ProductDetailPage() {
  const { productId = "" } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const productQuery = useQuery(productDetailQueryOptions(productId))
  const createSessionMutation = useCreateSessionMutation()
  const addToCartMutation = useUpsertCartItemMutation()

  if (productQuery.isPending) {
    return (
      <div className="grid gap-8 sm:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-none" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-2/3 rounded-none" />
          <Skeleton className="h-4 w-1/3 rounded-none" />
          <Skeleton className="h-20 w-full rounded-none" />
        </div>
      </div>
    )
  }

  if (productQuery.isError || !productQuery.data) {
    return <p className="text-sm text-destructive">Không tìm thấy sản phẩm.</p>
  }

  const product = productQuery.data

  function handleChat() {
    if (!user || user.role !== "CUSTOMER") {
      navigate(`${urlPaths.login}?productId=${product.id}`)
      return
    }
    createSessionMutation.mutate({ productId: product.id })
  }

  function handleAddToCart() {
    if (!user || (user.role !== "CUSTOMER" && user.role !== "ADMIN")) {
      navigate(urlPaths.login)
      return
    }
    addToCartMutation.mutate({ productId: product.id, quantity: 1 })
  }

  return (
    <div className="space-y-8">
      <Link to={urlPaths.home} className="text-xs text-muted-foreground underline">
        ← Bộ sưu tập
      </Link>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="metal-sheen flex size-full items-center justify-center px-4 text-center text-sm font-medium text-slate-700">
              {product.name}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              {product.sku}
            </p>
            <h1 className="mt-1 text-2xl font-light tracking-wide">{product.name}</h1>
          </div>
          {product.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}
          <div className="space-y-1 border-t border-border pt-4 text-sm text-muted-foreground">
            <p>Trọng lượng: {product.weightGrams}g</p>
            <p>Công thợ: {formatVnd(product.laborCost)}</p>
            <p>Size chuẩn: {product.baseSize}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              className="rounded-none"
              disabled={createSessionMutation.isPending}
              onClick={handleChat}
            >
              {createSessionMutation.isPending ? "Đang mở..." : "Hỏi giá"}
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              disabled={addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              {addToCartMutation.isPending ? "Đang thêm..." : "Thêm giỏ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
