import type { ChatMessage, ChatSessionDetail } from "../types/chat.types"

export function appendMessageToSession(
  session: ChatSessionDetail | undefined,
  message: ChatMessage
): ChatSessionDetail | undefined {
  if (!session || session.id !== message.sessionId) {
    return session
  }

  if (session.messages.some((existing) => existing.id === message.id)) {
    return session
  }

  return { ...session, messages: [...session.messages, message] }
}
