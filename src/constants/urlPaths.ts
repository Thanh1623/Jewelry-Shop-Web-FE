export const urlPaths = {
  home: "/",
  login: "/login",
  register: "/register",
  chatSession: (sessionId: string) => `/chat/${sessionId}`,
  saleDashboard: "/sale",
  saleSessionDetail: (sessionId: string) => `/sale/sessions/${sessionId}`,
} as const
