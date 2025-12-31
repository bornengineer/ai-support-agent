import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { marked } from "marked";

type Msg = {
  id?: number;
  sender: "user" | "ai";
  text: string;
  created_at?: string;
};

function App() {
  const [sessionId, setSessionId] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  useLayoutEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const truncateText = (text: string, maxLength = 2000) => {
    if (!text) return text;
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const loadHistory = async () => {
    if (!sessionId.trim()) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/chat/history/${sessionId}`
      );
      setMsgs(res.data.messages || []);
    } catch (e) {
      console.error(e);
      alert("Error loading history");
    }
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || pending) return;

    setInput("");
    setPending(true);
    setTyping(true);

    // show full message locally
    setMsgs((prev) => [
      ...prev,
      { sender: "user", text: trimmed, created_at: new Date().toISOString() },
    ]);

    // truncated for API
    const safeText = truncateText(trimmed, 2000);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/message`,
        {
          message: safeText,
          sessionId: sessionId.trim() ? sessionId : undefined,
        }
      );

      const replyText = res.data.reply || "No reply";

      setMsgs((prev) => [
        ...prev,
        { sender: "ai", text: replyText, created_at: new Date().toISOString() },
      ]);
    } catch (err) {
      setMsgs((prev) => [
        ...prev,
        { sender: "ai", text: "Server Error. Try again later." },
      ]);
    } finally {
      setPending(false);
      setTyping(false);

      // Focus input again
      setShouldFocus(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderTime = (ts?: string) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMsgHTML = (txt: string) => {
    return { __html: marked.parse(txt) };
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 640,
        mx: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        my: 5,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6">AI Live Chat Agent</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button variant="contained" onClick={loadHistory}>
            Load
          </Button>
        </Box>
      </Box>

      {/* Conversation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
          bgcolor: "#fafafa",
          borderRadius: 2,
          border: "1px solid #ddd",
        }}
      >
        {msgs.map((m, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 1.1,
                maxWidth: "80%",
                position: "relative",
                bgcolor: m.sender === "user" ? "#1e88e5" : "#ffffff",
                color: m.sender === "user" ? "#fff" : "#000",
                mt: m.sender === "user" ? 3 : 0,
                mb: m.sender === "user" ? 1 : 0,
              }}
            >
              <span dangerouslySetInnerHTML={formatMsgHTML(m.text)} />
              <Typography sx={{ fontSize: 10, textAlign: "right", mt: 0.5 }}>
                {renderTime(m.created_at)}
              </Typography>
            </Paper>
          </Box>
        ))}

        {typing && (
          <Typography variant="body2" sx={{ color: "#777", ml: 1 }}>
            Agent is typing...
          </Typography>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input panel */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 1,
          p: 1,
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#f5f5f5" : "#222",
          borderRadius: 3,
        }}
      >
        <TextField
          inputRef={inputRef}
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          disabled={pending}
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === "light" ? "#fff" : "#333",
              px: 2,
            },
          }}
        />

        <IconButton
          color="primary"
          type="submit"
          disabled={pending || !input.trim()}
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            color: "#fff",
            "&:hover": {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
            p: 1.5,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {pending ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            <SendIcon fontSize="medium" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}

export default App;
