export interface CartProduct {
  id: string
  sku: string
  name: string
  imageUrl: string | null
  weightGrams: number
  laborCost: number
}

export interface CartLine {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  lineTotal: number
  product: CartProduct
}

export interface Cart {
  items: CartLine[]
  totalAmount: number
  itemCount: number
}

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "CANCELLED" | "FAILED"

export interface OrderItem {
  id: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  totalAmount: number
  paymentProvider: string
  paymentRef: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}
