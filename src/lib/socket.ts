import { io, type Socket } from "socket.io-client"

export function createSocket(token?: string | null): Socket {
  return io(import.meta.env.VITE_SOCKET_URL, {
    auth: token ? { token } : undefined,
  })
}
