import { Box } from "@mui/material";
import { useChat } from "./hooks/useChat";
import { ChatHeader } from "./components/ChatHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";

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
    <Box
      sx={{
        maxWidth: 640,
        mx: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        my: 5,
      }}
    >
      <ChatHeader
        onLoadHistory={loadHistory}
        onLoadLastSession={loadLastSession}
      />

      <MessageList msgs={msgs} typing={typing} />

      <ChatInput onSend={sendMessage} pending={pending} />
    </Box>
  );
}

export default App;
