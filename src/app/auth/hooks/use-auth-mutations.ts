import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { urlPaths } from "@/constants/urlPaths"
import { getApiErrorMessage } from "@/lib/get-api-error-message"
import { useAuthStore } from "@/stores/auth-store"

import { authKeys } from "../queries/auth.keys"
import { loginRequest, registerRequest } from "../services/auth.service"
import type { LoginPayload, RegisterPayload } from "../types/auth.types"

export function useLoginMutation() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
      queryClient.setQueryData(authKeys.me(), data.user)
      toast.success("Đăng nhập thành công.")
      navigate(data.user.role === "SALE" ? urlPaths.saleDashboard : urlPaths.home, {
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đăng nhập thất bại."))
    },
  })
}

export function useRegisterMutation() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
      queryClient.setQueryData(authKeys.me(), data.user)
      toast.success("Đăng ký thành công.")
      navigate(urlPaths.home, { replace: true })
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Đăng ký thất bại."))
    },
  })
}
