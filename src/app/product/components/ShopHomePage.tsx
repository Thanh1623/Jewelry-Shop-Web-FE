import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useUpsertCartItemMutation } from "@/app/cart/hooks/use-cart-mutations"
import { useCreateSessionMutation } from "@/app/chat/hooks/use-chat-mutations"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

import { productsQueryOptions } from "../queries/product.queries"
import type { Product } from "../types/product.types"
import { ProductCard } from "./ProductCard"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=2000&q=85"

const CATEGORIES = [
  { key: "ALL", label: "Tất cả" },
  { key: "RING", label: "Nhẫn" },
  { key: "NECK", label: "Dây chuyền" },
  { key: "BRAC", label: "Lắc tay" },
  { key: "EAR", label: "Bông tai" },
] as const

type CategoryKey = (typeof CATEGORIES)[number]["key"]

export function ShopHomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CategoryKey>("ALL")
  const productsQuery = useQuery(productsQueryOptions())
  const createSessionMutation = useCreateSessionMutation()
  const addToCartMutation = useUpsertCartItemMutation()

  const filteredProducts = useMemo(() => {
    const list = productsQuery.data ?? []
    const term = search.trim().toLowerCase()
    return list.filter((product) => {
      const matchesCategory = category === "ALL" || product.sku.startsWith(category)
      const matchesSearch = !term || product.name.toLowerCase().includes(term)
      return matchesCategory && matchesSearch
    })
  }, [productsQuery.data, search, category])

  function handleChatClick(product: Product) {
    if (!user || user.role !== "CUSTOMER") {
      navigate(`${urlPaths.login}?productId=${product.id}`)
      return
    }
    createSessionMutation.mutate({ productId: product.id })
  }

  function handleAddToCart(product: Product) {
    if (!user || (user.role !== "CUSTOMER" && user.role !== "ADMIN")) {
      navigate(urlPaths.login)
      return
    }
    addToCartMutation.mutate({ productId: product.id, quantity: 1 })
  }

  return (
    <div>
      {/* Inspired by Tiffany / Cartier editorial heroes: brand first, full-bleed, one CTA */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Trang sức bạc Bạc Ý"
          className="absolute inset-0 size-full object-cover animate-hero-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 text-white sm:px-6 sm:pb-20">
          <p className="animate-fade-up text-[11px] tracking-[0.4em] text-white/70 uppercase">
            Silver atelier
          </p>
          <h1 className="animate-fade-up-delay-1 mt-3 max-w-3xl text-5xl leading-[0.95] font-light tracking-[0.12em] sm:text-7xl md:text-8xl">
            BẠC Ý
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            Trang sức bạc 925 chế tác tinh xảo — hỏi giá realtime với chuyên viên và thợ kim hoàn.
          </p>
          <a
            href="#bo-suu-tap"
            className="animate-fade-up-delay-3 mt-8 inline-flex border border-white/70 px-7 py-3 text-xs tracking-[0.22em] uppercase transition hover:bg-white hover:text-slate-900"
          >
            Khám phá
          </a>
        </div>
      </section>

      <section id="bo-suu-tap" className="scroll-mt-20 bg-background">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
                Collection
              </p>
              <h2 className="mt-1 text-2xl font-light tracking-wide sm:text-3xl">Bộ sưu tập</h2>
            </div>
            <p className="hidden max-w-xs text-right text-xs leading-relaxed text-muted-foreground sm:block">
              Chọn mẫu · Đăng nhập · Nhận báo giá realtime
            </p>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCategory(item.key)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs tracking-wide uppercase transition",
                    category === item.key
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="h-9 max-w-xs rounded-full"
            />
          </div>

          {productsQuery.isPending && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <Skeleton className="h-3 w-2/3 rounded-none" />
                </div>
              ))}
            </div>
          )}

          {productsQuery.isError && (
            <p className="text-sm text-destructive">Không tải được sản phẩm.</p>
          )}

          {productsQuery.data && filteredProducts.length === 0 && (
            <p className="text-sm text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
          )}

          {productsQuery.data && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onChatClick={handleChatClick}
                  onAddToCart={handleAddToCart}
                  isStarting={createSessionMutation.isPending}
                  isAddingToCart={addToCartMutation.isPending}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-6 sm:py-14">
          {[
            { title: "Bạc 925", desc: "Chất liệu chuẩn, hoàn thiện bóng gương hoặc mờ." },
            { title: "Tư vấn realtime", desc: "Chat trực tiếp với sale, hỗ trợ AI và thợ chế tác." },
            { title: "Báo giá minh bạch", desc: "Theo trọng lượng, size và công thợ — chỉnh trước khi gửi." },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-sm tracking-[0.18em] uppercase">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
