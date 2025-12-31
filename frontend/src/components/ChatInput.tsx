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
  );
};
