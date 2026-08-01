import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  quoteDefaultValues,
  quoteSchema,
  type QuoteFormInput,
  type QuoteFormValues,
} from "../schemas/quote.schema"

interface QuoteFormProps {
  isSubmitting: boolean
  onSubmit: (values: QuoteFormValues) => void
}

export function QuoteForm({ isSubmitting, onSubmit }: QuoteFormProps) {
  const form = useForm<QuoteFormInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: quoteDefaultValues,
  })

  function handleSubmit(values: QuoteFormInput) {
    onSubmit(quoteSchema.parse(values))
    form.reset(quoteDefaultValues)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-wrap items-end gap-2 rounded-xl border border-teal-100 bg-teal-50/50 p-2.5"
      >
        <FormField
          control={form.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem className="w-28 gap-1">
              <FormLabel className="text-[11px] text-slate-500">Đơn giá (đ)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className="h-8"
                  {...field}
                  value={field.value as number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="w-16 gap-1">
              <FormLabel className="text-[11px] text-slate-500">SL</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  className="h-8"
                  {...field}
                  value={field.value as number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="w-16 gap-1">
              <FormLabel className="text-[11px] text-slate-500">Size</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  className="h-8"
                  {...field}
                  value={(field.value as number | undefined) ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="sm" className="h-8 rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi báo giá"}
        </Button>
      </form>
    </Form>
  )
}
