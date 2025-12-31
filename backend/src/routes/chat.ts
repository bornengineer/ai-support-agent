import express, { Request, Response } from "express";
import { pool } from "../services/db";
import { generateReply } from "../services/llm";

const router = express.Router();

router.post("/message", async (req: Request, res: Response) => {
  const { message, sessionId } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Empty message" });
  const { v4: uuidv4 } = await import("uuid");
  const convoId = sessionId || uuidv4();

  try {
    await pool.query(
      `INSERT INTO conversations(id) VALUES($1) ON CONFLICT DO NOTHING`,
      [convoId]
    );
    await pool.query(
      `INSERT INTO messages(conversation_id, sender, text) VALUES($1, $2, $3)`,
      [convoId, "user", message]
    );

    const messagesRes = await pool.query(
      `SELECT sender, text FROM messages WHERE conversation_id = $1 ORDER BY id`,
      [convoId]
    );
    const history = messagesRes.rows;

    const reply = await generateReply(history);

    await pool.query(
      `INSERT INTO messages(conversation_id, sender, text) VALUES($1, $2, $3)`,
      [convoId, "ai", reply]
    );

    return res.json({ reply, sessionId: convoId });
  } catch (err) {
    return res.status(500).json({ error: "Server Error" });
  }
});

router.get("/history/:sessionId", async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: "No sessionId" });

  try {
    const result = await pool.query(
      `SELECT id, sender, text, created_at FROM messages WHERE conversation_id=$1 ORDER BY id`,
      [sessionId]
    );
    return res.json({ messages: result.rows });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
