import dotenv from "dotenv";

dotenv.config();

export const config = {
  groqApiKey: process.env.GROQ_API_KEY || "",
  port: parseInt(process.env.PORT || "4000", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "",
};

if (!config.groqApiKey) {
  throw new Error("Missing GROQ_API_KEY in environment variables");
}
