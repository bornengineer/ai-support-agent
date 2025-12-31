import { pool } from "./db";
import { generateReply } from "./llm";
import { getCachedHistory, cacheHistory } from "./redis";

export const getConversationHistory = async (sessionId: string) => {
  // 1. Try Redis
  const cached = await getCachedHistory(sessionId);
  if (cached) {
    return cached;
  }

  // 2. Fallback to DB
  const res = await pool.query(
    `SELECT id, sender, text, created_at FROM messages WHERE conversation_id=$1 ORDER BY id`,
    [sessionId]
  );
  const rows = res.rows;

  // 3. Cache result
  if (rows.length > 0) {
    await cacheHistory(sessionId, rows);
  }
  return rows;
};

export const processUserMessage = async (sessionId: string, message: string) => {
  // 1. Ensure conversation exists
  await pool.query(
    `INSERT INTO conversations(id) VALUES($1) ON CONFLICT DO NOTHING`,
    [sessionId]
  );

  // 2. Insert User Message
  await pool.query(
    `INSERT INTO messages(conversation_id, sender, text) VALUES($1, $2, $3)`,
    [sessionId, "user", message]
  );

  // 3. Fetch History (DB only to be safe, or cache but bust it)
  // For simplicity, we fetch fresh from DB to get the latest state including the just-inserted one
  // In a high-perf scenario, we'd append to cache directly.
  const allMessagesRes = await pool.query(
    `SELECT sender, text, id, created_at FROM messages WHERE conversation_id = $1 ORDER BY id`,
    [sessionId]
  );
  const history = allMessagesRes.rows;

  // 4. Generate Reply
  const reply = await generateReply(history);

  // 5. Insert AI Reply
  await pool.query(
    `INSERT INTO messages(conversation_id, sender, text) VALUES($1, $2, $3)`,
    [sessionId, "ai", reply]
  );

  // 6. Update Cache with new full history
  // Re-fetch or manually construct. We can just append to `history` locally and cache.
  // Note: we need the complete row for consistency with getHistory structure if we want to cache it.
  const newAiMsg = {
    conversation_id: sessionId,
    sender: "ai",
    text: reply,
    created_at: new Date(), // approx
  };
  const updatedHistory = [...history, newAiMsg];
  await cacheHistory(sessionId, updatedHistory);

  return reply;
};
