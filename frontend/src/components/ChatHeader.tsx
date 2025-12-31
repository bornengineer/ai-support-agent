import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip, TextField, Button } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

interface ChatHeaderProps {
  onLoadHistory: (sessionId: string) => void;
  onLoadLastSession: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onLoadHistory, onLoadLastSession }) => {
  const [sessionIdInput, setSessionIdInput] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 1,
      }}
    >
      <Typography variant="h6">AI Live Chat Agent</Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Load Last Session">
          <IconButton onClick={onLoadLastSession}>
            <RestoreIcon />
          </IconButton>
        </Tooltip>
        <TextField
          size="small"
          placeholder="Session ID"
          value={sessionIdInput}
          onChange={(e) => setSessionIdInput(e.target.value)}
          sx={{ width: 200 }}
        />
        <Button
          variant="contained"
          onClick={() => onLoadHistory(sessionIdInput)}
        >
          Load
        </Button>
      </Box>
    </Box>
  );
};
