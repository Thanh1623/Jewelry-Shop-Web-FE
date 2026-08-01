import { useState } from "react"

import { formatVnd } from "../utils/format-price"
import type { Product } from "../types/product.types"

interface ProductCardProps {
  product: Product
  onChatClick: (product: Product) => void
  isStarting?: boolean
  index?: number
}

export function ProductCard({
  product,
  onChatClick,
  isStarting,
  index = 0,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(product.imageUrl) && !imageFailed

  return (
    <article
      className="group flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
    >
      <button
        type="button"
        disabled={isStarting}
        onClick={() => onChatClick(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-muted text-left disabled:opacity-60"
      >
        {showImage ? (
          <img
            src={product.imageUrl!}
            alt={product.name}
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="metal-sheen flex size-full items-center justify-center px-3 text-center text-sm font-medium text-slate-700">
            {product.name}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/25" />
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-white/95 px-3 py-3 text-center text-[11px] tracking-[0.2em] text-slate-900 uppercase transition duration-500 group-hover:translate-y-0">
          {isStarting ? "Đang mở..." : "Hỏi giá"}
        </span>
      </button>
      <div className="mt-3 space-y-0.5">
        <h3 className="line-clamp-1 text-sm tracking-wide">{product.name}</h3>
        <p className="text-xs text-muted-foreground">
          {product.weightGrams}g · Công {formatVnd(product.laborCost)}
        </p>
      </div>
    </article>
  )
}
