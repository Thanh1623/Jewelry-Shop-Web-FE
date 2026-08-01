export interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  imageUrl: string | null
  weightGrams: number
  laborCost: number
  baseSize: number
  sizeDeltaGrams: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
