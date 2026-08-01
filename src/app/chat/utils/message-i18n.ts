import type { ChatMessage, ChatMessageMeta, MessageI18nMeta } from "../types/chat.types"

export function getMessageI18n(message: ChatMessage): MessageI18nMeta | null {
  const meta = message.metaJson as ChatMessageMeta | null
  return meta?.i18n ?? null
}
