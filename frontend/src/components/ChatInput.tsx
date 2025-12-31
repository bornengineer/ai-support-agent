import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSend: (message: string) => void;
  pending: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, pending }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  useLayoutEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  useEffect(() => {
    // Focus when pending state changes from true to false (i.e., message sent)
    if (!pending) {
      setShouldFocus(true);
    }
  }, [pending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !pending) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mt: 'auto',
        p: 1.5,
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: 3,
        mx: 2,
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
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
        maxRows={3}
        disabled={pending}
        variant="standard" // Remove default outline to blend
        InputProps={{
            disableUnderline: true,
            sx: { px: 1, color: "text.primary" }
        }}
        sx={{
            overflowY: 'auto'
        }}
      />

      <IconButton
        type="submit"
        disabled={pending || !input.trim()}
        sx={{
          bgcolor: "primary.main",
          color: "#fff",
          "&:hover": {
            bgcolor: "primary.dark",
          },
          p: 1.5,
          borderRadius: "50%",
          transition: "transform 0.1s",
          "&:active": {
            transform: "scale(0.95)",
          },
          "&.Mui-disabled": {
            bgcolor: "action.disabledBackground",
            color: "action.disabled",
          },
        }}
      >
        {pending ? (
          <CircularProgress size={24} sx={{ color: "inherit" }} />
        ) : (
          <SendIcon fontSize="small" />
        )}
      </IconButton>
    </Box>
  );
};
