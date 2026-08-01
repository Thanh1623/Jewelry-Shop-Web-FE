import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { urlPaths } from "@/constants/urlPaths"
import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { cartKeys, orderKeys } from "../queries/cart.keys"
import {
  removeCartItemRequest,
  updateCartQuantityRequest,
  upsertCartItemRequest,
} from "../services/cart.service"
import {
  cancelOrderRequest,
  checkoutRequest,
  payDemoRequest,
} from "../services/order.service"

export function useUpsertCartItemMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: upsertCartItemRequest,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.me(), cart)
      toast.success("Đã thêm vào giỏ.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thêm được vào giỏ."))
    },
  })
}

export function useUpdateCartQuantityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartQuantityRequest(itemId, quantity),
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.me(), cart)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không cập nhật được số lượng."))
    },
  })
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeCartItemRequest,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.me(), cart)
      toast.success("Đã xóa khỏi giỏ.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không xóa được mục."))
    },
  })
}

export function useCheckoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: checkoutRequest,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      navigate(urlPaths.orderDetail(order.id))
      toast.success("Đã tạo đơn — thanh toán demo bên dưới.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Checkout thất bại."))
    },
  })
}

export function usePayDemoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: payDemoRequest,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order)
      queryClient.invalidateQueries({ queryKey: orderKeys.list() })
      queryClient.invalidateQueries({ queryKey: cartKeys.me() })
      toast.success("Thanh toán demo thành công.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Thanh toán demo thất bại."))
    },
  })
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: cancelOrderRequest,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.id), order)
      queryClient.invalidateQueries({ queryKey: orderKeys.list() })
      toast.success("Đã hủy đơn.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không hủy được đơn."))
    },
  })
}
