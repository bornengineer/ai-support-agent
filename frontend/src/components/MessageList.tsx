import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import type { Msg } from "../types/chat";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  msgs: Msg[];
  typing: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ msgs, typing }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        // Removed hardcoded bgcolor and border to let background shine through
      }}
    >
      {msgs.map((m, idx) => (
        <MessageBubble key={idx} msg={m} />
      ))}

      {typing && (
        <Typography variant="body2" sx={{ color: "#b9b9b9ff", ml: 1 }}>
          Agent is typing...
        </Typography>
      )}
      <div ref={bottomRef} />
    </Box>
  );
};
