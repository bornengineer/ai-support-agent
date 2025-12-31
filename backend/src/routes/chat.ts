import express, { Request, Response } from "express";
import { processUserMessage, getConversationHistory } from "../services/chatService";

const router = express.Router();

router.post("/message", async (req: Request, res: Response) => {
  const { message, sessionId } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Empty message" });
  
  const { v4: uuidv4 } = await import("uuid");
  const convoId = sessionId || uuidv4();

  try {
    const reply = await processUserMessage(convoId, message);
    return res.json({ reply, sessionId: convoId });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

router.get("/history/:sessionId", async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: "No sessionId" });

  try {
    const messages = await getConversationHistory(sessionId);
    return res.json({ messages });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
