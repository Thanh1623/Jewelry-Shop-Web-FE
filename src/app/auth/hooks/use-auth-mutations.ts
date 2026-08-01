import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { createSessionRequest } from "@/app/chat/services/chat.service"
import { urlPaths } from "@/constants/urlPaths"
import { getApiErrorMessage } from "@/lib/get-api-error-message"
import { useAuthStore } from "@/stores/auth-store"

import { authKeys } from "../queries/auth.keys"
import { loginRequest, registerRequest } from "../services/auth.service"
import type { LoginPayload, RegisterPayload } from "../types/auth.types"

async function continueAfterCustomerAuth(
  productId: string | null,
  navigate: ReturnType<typeof useNavigate>
) {
  if (!productId) {
    navigate(urlPaths.home, { replace: true })
    return
  }
  try {
    const session = await createSessionRequest({ productId })
    navigate(urlPaths.chatSession(session.id), { replace: true })
  } catch (error) {
    toast.error(getApiErrorMessage(error, "Không thể bắt đầu trò chuyện."))
    navigate(urlPaths.home, { replace: true })
  }
}

export function useLoginMutation() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()
  const productId = searchParams.get("productId")

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: async (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      queryClient.setQueryData(authKeys.me(), data.user)
      toast.success("Đăng nhập thành công.")
      if (data.user.role === "ADMIN") {
        navigate(urlPaths.adminProducts, { replace: true })
        return
      }
      if (data.user.role === "SALE") {
        navigate(urlPaths.saleDashboard, { replace: true })
        return
      }
      await continueAfterCustomerAuth(productId, navigate)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đăng nhập thất bại."))
    },
  })
}

export function useRegisterMutation() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()
  const productId = searchParams.get("productId")

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: async (data) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      queryClient.setQueryData(authKeys.me(), data.user)
      toast.success("Đăng ký thành công.")
      await continueAfterCustomerAuth(productId, navigate)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đăng ký thất bại."))
    },
  })
}
