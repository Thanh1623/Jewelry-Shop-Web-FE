import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { formatVnd } from "../utils/format-price"
import { adminProductsQueryOptions } from "../queries/product.queries"
import { productKeys } from "../queries/product.keys"
import {
  createProductRequest,
  deleteProductRequest,
  updateProductRequest,
  type ProductWritePayload,
} from "../services/product.service"
import type { Product } from "../types/product.types"

const emptyForm: ProductWritePayload = {
  sku: "",
  name: "",
  description: "",
  imageUrl: "",
  weightGrams: 3,
  laborCost: 100_000,
  isActive: true,
}

export function AdminProductsPage() {
  const queryClient = useQueryClient()
  const productsQuery = useQuery(adminProductsQueryOptions())
  const [form, setForm] = useState<ProductWritePayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: ProductWritePayload = {
        ...form,
        sku: form.sku.trim(),
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
        weightGrams: Number(form.weightGrams),
        laborCost: Number(form.laborCost),
      }
      if (editingId) {
        return updateProductRequest(editingId, payload)
      }
      return createProductRequest(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success(editingId ? "Đã cập nhật sản phẩm." : "Đã tạo sản phẩm.")
      setForm(emptyForm)
      setEditingId(null)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Lưu sản phẩm thất bại."))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProductRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      toast.success("Đã ẩn sản phẩm (soft delete).")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không ẩn được sản phẩm."))
    },
  })

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      weightGrams: product.weightGrams,
      laborCost: product.laborCost,
      baseSize: product.baseSize,
      sizeDeltaGrams: product.sizeDeltaGrams,
      isActive: product.isActive,
    })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    saveMutation.mutate()
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-4">
        <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">Admin</p>
        <h1 className="mt-1 text-2xl font-light tracking-wide">Quản lý sản phẩm</h1>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 border border-border p-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            required
            className="rounded-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name">Tên</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="rounded-none"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="rounded-none"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            className="rounded-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weightGrams">Trọng lượng (g)</Label>
          <Input
            id="weightGrams"
            type="number"
            step="0.1"
            min="0.1"
            value={form.weightGrams}
            onChange={(e) =>
              setForm((f) => ({ ...f, weightGrams: Number(e.target.value) }))
            }
            required
            className="rounded-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="laborCost">Công thợ (VND)</Label>
          <Input
            id="laborCost"
            type="number"
            min="0"
            value={form.laborCost}
            onChange={(e) =>
              setForm((f) => ({ ...f, laborCost: Number(e.target.value) }))
            }
            required
            className="rounded-none"
          />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          <Label htmlFor="isActive">Đang bán</Label>
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" className="rounded-none" disabled={saveMutation.isPending}>
            {editingId ? "Cập nhật" : "Thêm mới"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => {
                setEditingId(null)
                setForm(emptyForm)
              }}
            >
              Hủy sửa
            </Button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs tracking-wide uppercase">
            <tr>
              <th className="p-3 font-medium">SKU</th>
              <th className="p-3 font-medium">Tên</th>
              <th className="p-3 font-medium">g / công</th>
              <th className="p-3 font-medium">TT</th>
              <th className="p-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productsQuery.data?.map((product) => (
              <tr key={product.id}>
                <td className="p-3 font-mono text-xs">{product.sku}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3 text-muted-foreground">
                  {product.weightGrams}g · {formatVnd(product.laborCost)}
                </td>
                <td className="p-3">{product.isActive ? "Bán" : "Ẩn"}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-none"
                      onClick={() => startEdit(product)}
                    >
                      Sửa
                    </Button>
                    {product.isActive && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="rounded-none"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(product.id)}
                      >
                        Ẩn
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
