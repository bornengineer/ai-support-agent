import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { marked } from "marked";
import type { Msg } from "../types/chat";

interface MessageBubbleProps {
  msg: Msg;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
  const isUser = msg.sender === "user";

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
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 1.1,
          maxWidth: "80%",
          position: "relative",
          bgcolor: isUser ? "#1e88e5" : "#ffffff",
          color: isUser ? "#fff" : "#000",
          mt: isUser ? 3 : 0,
          mb: isUser ? 1 : 0,
        }}
      >
        <span dangerouslySetInnerHTML={formatMsgHTML(msg.text)} />
        <Typography sx={{ fontSize: 10, textAlign: "right", mt: 0.5 }}>
          {renderTime(msg.created_at)}
        </Typography>
      </Paper>
    </Box>
  );
};
