import { Box, ThemeProvider, CssBaseline, Paper } from "@mui/material";
import { useChat } from "./hooks/useChat";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { theme } from "./theme";

function App() {
  const {
    msgs,
    pending,
    typing,
    loadHistory,
    loadLastSession,
    sendMessage,
  } = useChat();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2, 
        }}
      >
        {/* Main Chat Container */}
        <Paper
          elevation={4}
          sx={{
             width: "100%",
             maxWidth: 700,
             height: "90vh",
             display: "flex",
             flexDirection: "column",
             borderRadius: 4,
             overflow: "hidden",
             border: "1px solid",
             borderColor: "divider",
             bgcolor: "background.paper",
          }}
        >
          <ChatHeader
            onLoadHistory={loadHistory}
            onLoadLastSession={loadLastSession}
          />

          <MessageList msgs={msgs} typing={typing} />

          <ChatInput onSend={sendMessage} pending={pending} />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
