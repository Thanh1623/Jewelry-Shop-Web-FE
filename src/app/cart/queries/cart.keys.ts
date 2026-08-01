export const cartKeys = {
  all: ["cart"] as const,
  me: () => [...cartKeys.all, "me"] as const,
}

export const orderKeys = {
  all: ["orders"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  adminList: () => [...orderKeys.all, "admin"] as const,
}
