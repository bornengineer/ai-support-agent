import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Button,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";

interface ChatHeaderProps {
  onLoadHistory: (sessionId: string) => void;
  onLoadLastSession: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onLoadHistory,
  onLoadLastSession,
}) => {
  const [sessionIdInput, setSessionIdInput] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        p: 2,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" color="text.primary">
          AI Live Chat Agent
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Tooltip title="Load last session">
          <IconButton
            onClick={onLoadLastSession}
            color="primary"
            disabled={!localStorage.getItem("lastSessionId")}
          >
            <RestoreIcon />
          </IconButton>
        </Tooltip>
        <TextField
          size="small"
          placeholder="Session ID"
          value={sessionIdInput}
          onChange={(e) => setSessionIdInput(e.target.value)}
          sx={{ width: 140 }}
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => onLoadHistory(sessionIdInput)}
          sx={{ borderRadius: 2 }}
        >
          Load
        </Button>
      </Box>
    </Box>
  );
};
