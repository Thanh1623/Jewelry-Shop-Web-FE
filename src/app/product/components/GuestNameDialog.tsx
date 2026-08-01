import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  guestNameDefaultValues,
  guestNameSchema,
  type GuestNameFormInput,
} from "../schemas/guest-name.schema"
import type { Product } from "../types/product.types"

interface GuestNameDialogProps {
  product: Product | null
  onOpenChange: (open: boolean) => void
  onConfirm: (guestName: string) => void
  isSubmitting: boolean
}

export function GuestNameDialog({
  product,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: GuestNameDialogProps) {
  const form = useForm<GuestNameFormInput>({
    resolver: zodResolver(guestNameSchema),
    defaultValues: guestNameDefaultValues,
  })

  function onSubmit(values: GuestNameFormInput) {
    onConfirm(values.guestName)
  }

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open) {
          form.reset(guestNameDefaultValues)
        }
        onOpenChange(open)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat hỏi giá</DialogTitle>
          <DialogDescription>
            Nhập tên để chat về <span className="font-medium text-foreground">{product?.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên của bạn</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Khách" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang tạo..." : "Bắt đầu trò chuyện"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
