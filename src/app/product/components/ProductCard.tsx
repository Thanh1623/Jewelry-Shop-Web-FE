import { MessageCircleQuestionIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

import { formatVnd } from "../utils/format-price"
import type { Product } from "../types/product.types"

interface ProductCardProps {
  product: Product
  onChatClick: (product: Product) => void
}

export function ProductCard({ product, onChatClick }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(product.imageUrl) && !imageFailed

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        {showImage ? (
          <img
            src={product.imageUrl!}
            alt={product.name}
            className="size-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-400 text-sm font-medium text-slate-700">
            {product.name}
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-1.5 pt-4">
        <h3 className="font-heading font-medium">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-2 text-sm">
          <dt className="text-muted-foreground">Khối lượng</dt>
          <dd className="text-right font-medium">{product.weightGrams}g</dd>
          <dt className="text-muted-foreground">Tiền công</dt>
          <dd className="text-right font-medium">{formatVnd(product.laborCost)}</dd>
        </dl>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onChatClick(product)}>
          <MessageCircleQuestionIcon data-icon="inline-start" />
          Chat hỏi giá
        </Button>
      </CardFooter>
    </Card>
  )
}
