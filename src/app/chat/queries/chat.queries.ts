import { queryOptions } from "@tanstack/react-query"

import {
  fetchOpenSessionsRequest,
  fetchSessionRequest,
} from "../services/chat.service"
import { chatKeys } from "./chat.keys"

export function chatSessionQueryOptions(sessionId: string) {
  return queryOptions({
    queryKey: chatKeys.session(sessionId),
    queryFn: () => fetchSessionRequest(sessionId),
    staleTime: 10_000,
  })
}

export function openChatSessionsQueryOptions() {
  return queryOptions({
    queryKey: chatKeys.sessions(),
    queryFn: fetchOpenSessionsRequest,
    // ponytail: polling instead of a dedicated "sessions list" socket room —
    // fine for a demo dashboard; upgrade to a socket broadcast if this needs to be real-time.
    refetchInterval: 8_000,
    staleTime: 5_000,
  })
}
