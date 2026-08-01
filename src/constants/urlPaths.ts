export const urlPaths = {
  home: "/",
  login: "/login",
  register: "/register",
  cart: "/cart",
  orders: "/orders",
  orderDetail: (orderId: string) => `/orders/${orderId}`,
  adminProducts: "/admin/products",
  chatSession: (sessionId: string) => `/chat/${sessionId}`,
  saleDashboard: "/sale",
  saleSessionDetail: (sessionId: string) => `/sale/sessions/${sessionId}`,
} as const
