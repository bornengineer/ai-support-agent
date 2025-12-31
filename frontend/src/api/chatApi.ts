import api from "../services/api";
import type { Msg } from "../types/chat";

export const getHistory = async (sessionId: string) => {
  const response = await api.get<{ messages: Msg[] }>(`/chat/history/${sessionId}`);
  return response.data;
};

export const sendMessage = async (message: string, sessionId?: string) => {
  const response = await api.post<{ reply: string; sessionId: string }>(
    "/chat/message",
    { message, sessionId }
  );
  return response.data;
};
