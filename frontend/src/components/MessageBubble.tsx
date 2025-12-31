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
        mb: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          maxWidth: "80%",
          borderRadius: 4,
          borderTopRightRadius: isUser ? 4 : 20, // for tail effect
          borderTopLeftRadius: isUser ? 20 : 4,
          bgcolor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
          boxShadow: 2,
        }}
      >
        <Typography
          variant="body1"
          component="div"
          sx={{
            "& p": { m: 0 },
            "& ul, & ol": { m: 0, pl: 2 },
            "& a": { color: "inherit", textDecoration: "underline" },
            lineHeight: 1.5,
          }}
        >
          <span dangerouslySetInnerHTML={formatMsgHTML(msg.text)} />
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 0.5,
            opacity: 0.7,
            fontSize: "0.7rem",
          }}
        >
          {renderTime(msg.created_at)}
        </Typography>
      </Paper>
    </Box>
  );
};
