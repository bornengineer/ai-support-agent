import express from "express";
import { pool } from "../services/db";
import { generateReply } from "../services/llm";

const router = express.Router();

router.post("/message", async (req, res) => {
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
      `SELECT text FROM messages WHERE conversation_id = $1 ORDER BY id`,
      [convoId]
    );
    const history = messagesRes.rows.map((r) => r.text);

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

export default router;
