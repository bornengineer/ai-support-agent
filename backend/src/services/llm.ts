import Groq from "groq-sdk";
import { config } from "../config";

const client = new Groq({
  apiKey: config.groqApiKey,
});

/**
 * Configuration assumptions:
 * - We limit recent history for cost control
 * - We cap max tokens to avoid runaway usage
 */
const MAX_HISTORY_MESSAGES = 10;
const MAX_TOKENS = 400;

/**
 * Hardcoded domain knowledge for the fictional ecommerce store.
 * This ensures consistent answers to FAQs.
 * The prompt guidance now allows the model to respond even when
 * a question is outside the scope by using general ecommerce knowledge.
 */
const STORE_KNOWLEDGE = `
Store Information (you may also answer reasonably beyond this when needed):

Shipping Policy:
- We ship domestically and internationally.
- Orders are usually processed within 24–48 hours.
- Standard delivery takes approximately 5–7 business days.

Return & Refund Policy:
- Items can be returned or exchanged within 30 days of delivery.
- Returned items should be unused and in their original packaging.
- Refunds are processed within 5–7 business days after receiving the return.

Support Hours:
- Support is available Monday to Friday, 9 AM to 6 PM IST.

If asked something not covered here, you may provide a reasonable, helpful
answer based on general ecommerce support knowledge, but be clear when you
are extrapolating beyond the provided store policies.
`;

/**
 * Generates an AI reply using Groq LLM.
 */
export async function generateReply(history: { sender: string; text: string }[]) {
  try {
    // Keep only the most recent messages for context
    const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

    const messages = [
      {
        role: "system" as const,
        content: `
You are a helpful, professional AI support agent for a small ecommerce store.
Answer clearly, concisely, and politely.

Use the following store information to answer FAQs when relevant. If the user's
question goes beyond the specific policies listed below, you are allowed to
respond using general ecommerce support knowledge in a helpful way, making it
clear you are extending beyond these concrete policies only if needed.

${STORE_KNOWLEDGE}
        `.trim(),
      },
      ...recentHistory.map((msg) => ({
        role: (msg.sender === "ai" ? "assistant" : "user") as "assistant" | "user",
        content: msg.text,
      })),
    ];

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.4,
    });

    // Return the model's text (trimmed)
    return response.choices[0]?.message?.content?.trim() || "";
  } catch (error: any) {
    // Server-side logging only
    console.error("Groq LLM Error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
    });

    // Friendly user-facing errors
    if (error?.status === 401) {
      return "I'm currently unable to authenticate. Please try again later.";
    }

    if (error?.status === 429) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    }

    if (error?.code === "ETIMEDOUT") {
      return "The response is taking longer than expected. Please try again shortly.";
    }

    return "I'm having trouble responding right now. Please try again in a few moments.";
  }
}
