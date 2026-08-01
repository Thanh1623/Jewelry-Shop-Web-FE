export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  adminList: () => [...productKeys.all, "admin"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
}
