import OpenAI from "openai";
import { config } from "../../config";

const client = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateReply(history: string[]) {
  try {
    const prompt: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: "You are a helpful AI support agent." },
      ...history.map((txt) => ({ role: "user" as const, content: txt })),
    ];

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // free model
      messages: prompt,
      max_tokens: 500,
    });

    return response.choices[0].message?.content ?? "";
  } catch (error: any) {
    console.error("Groq API Error:", error.message);
    return "I'm having trouble connecting right now.";
  }
}