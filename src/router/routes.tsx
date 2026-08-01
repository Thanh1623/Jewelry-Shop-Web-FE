import { createBrowserRouter, Navigate } from "react-router-dom"

import { LoginPage } from "@/app/auth/components/LoginPage"
import { RegisterPage } from "@/app/auth/components/RegisterPage"
import { CartPage } from "@/app/cart/components/CartPage"
import { OrderDetailPage } from "@/app/cart/components/OrderDetailPage"
import { OrdersPage } from "@/app/cart/components/OrdersPage"
import { ChatSessionPage } from "@/app/chat/components/ChatSessionPage"
import { AdminProductsPage } from "@/app/product/components/AdminProductsPage"
import { ShopHomePage } from "@/app/product/components/ShopHomePage"
import { SaleDashboardPage } from "@/app/sale/components/SaleDashboardPage"
import { SaleSessionDetailPage } from "@/app/sale/components/SaleSessionDetailPage"
import { AppLayout } from "@/components/layouts/AppLayout"
import { AuthLayout } from "@/components/layouts/AuthLayout"
import { GuestRoute } from "@/components/layouts/GuestRoute"
import { ProtectedRoute } from "@/components/layouts/ProtectedRoute"
import { ShopLayout } from "@/components/layouts/ShopLayout"
import { urlPaths } from "@/constants/urlPaths"

export const router = createBrowserRouter([
  {
    element: <ShopLayout />,
    children: [
      { path: urlPaths.home, element: <ShopHomePage /> },
      { path: "/chat/:sessionId", element: <ChatSessionPage /> },
      {
        element: <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]} />,
        children: [
          { path: urlPaths.cart, element: <CartPage /> },
          { path: urlPaths.orders, element: <OrdersPage /> },
          { path: "/orders/:orderId", element: <OrderDetailPage /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [{ path: urlPaths.adminProducts, element: <AdminProductsPage /> }],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: urlPaths.login, element: <LoginPage /> },
          { path: urlPaths.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["SALE"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: urlPaths.saleDashboard, element: <SaleDashboardPage /> },
          { path: "/sale/sessions/:sessionId", element: <SaleSessionDetailPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to={urlPaths.home} replace /> },
])
