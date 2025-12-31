import { useState, useEffect } from "react";
import type { Msg } from "../types/chat";
import { getHistory, sendMessage as apiSendMessage } from "../api/chatApi";

export const useChat = () => {
  const [sessionId, setSessionId] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [pending, setPending] = useState(false);
  const [typing, setTyping] = useState(false);

  const truncateText = (text: string, maxLength = 2000) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("lastSessionId", sessionId);
    }
  }, [sessionId]);

  const loadLastSession = () => {
    const sid = localStorage.getItem("lastSessionId");
    if (sid) {
      setSessionId(sid);
      loadHistory(sid);
    }
  };

  const loadHistory = async (sid: string) => {
    if (!sid.trim()) return;
    try {
      const data = await getHistory(sid);
      setSessionId(sid);
      setMsgs(data.messages || []);
    } catch (e) {
      console.error(e);
      alert("Error loading history");
    }
  };

  const sendMessage = async (message: string) => {
    const trimmed = truncateText(message.trim());
    if (!trimmed || pending) return;

    setPending(true);
    setTyping(true);

    // Optimistic update
    setMsgs((prev) => [
      ...prev,
      { sender: "user", text: trimmed, created_at: new Date().toISOString() },
    ]);

    try {
      const data = await apiSendMessage(trimmed, sessionId);
      setSessionId(data.sessionId);
      setMsgs((prev) => [
        ...prev,
        { sender: "ai", text: data.reply, created_at: new Date().toISOString() },
      ]);
    } catch (err) {
      setMsgs((prev) => [
        ...prev,
        { sender: "ai", text: "Server Error. Try again later." },
      ]);
    } finally {
      setPending(false);
      setTyping(false);
    }
  };

  return {
    sessionId,
    setSessionId, // Exposed if manual override needed, though usually handled internally
    msgs,
    pending,
    typing,
    loadHistory,
    loadLastSession,
    sendMessage,
  };
};
