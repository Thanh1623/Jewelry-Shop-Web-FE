export const apiPaths = {
  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  products: "/products",
  chatSessions: "/chat/sessions",
  chatTranslatePreview: (sessionId: string) =>
    `/chat/sessions/${sessionId}/translate-preview`,
  advisorAsk: "/advisor/ask",
  craftsmanAsk: "/webhooks/craftsman/ask",
} as const
