import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

import { useCreateSessionMutation } from "@/app/chat/hooks/use-chat-mutations"
import { Skeleton } from "@/components/ui/skeleton"

import { productsQueryOptions } from "../queries/product.queries"
import type { Product } from "../types/product.types"
import { GuestNameDialog } from "./GuestNameDialog"
import { ProductCard } from "./ProductCard"

export function ShopHomePage() {
  const productsQuery = useQuery(productsQueryOptions())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const createSessionMutation = useCreateSessionMutation()

  function handleConfirm(guestName: string) {
    if (!selectedProduct) {
      return
    }

    createSessionMutation.mutate(
      { productId: selectedProduct.id, guestName },
      { onSuccess: () => setSelectedProduct(null) }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Bộ sưu tập trang sức bạc</h1>
        <p className="text-muted-foreground">
          Chọn một sản phẩm và trò chuyện với chúng tôi để nhận báo giá.
        </p>
      </div>

      {productsQuery.isPending && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-3xl" />
          ))}
        </div>
      )}

      {productsQuery.isError && (
        <p className="text-sm text-destructive">Không thể tải danh sách sản phẩm.</p>
      )}

      {productsQuery.data && productsQuery.data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Chưa có sản phẩm nào. Hãy khởi động lại Shop API để seed dữ liệu demo.
        </p>
      )}

      {productsQuery.data && productsQuery.data.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {productsQuery.data.map((product) => (
            <ProductCard key={product.id} product={product} onChatClick={setSelectedProduct} />
          ))}
        </div>
      )}

      <GuestNameDialog
        product={selectedProduct}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null)
          }
        }}
        onConfirm={handleConfirm}
        isSubmitting={createSessionMutation.isPending}
      />
    </div>
  )
}
