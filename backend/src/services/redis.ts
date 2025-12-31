import { createClient } from "redis";
import { config } from "../config";

let redisClient: ReturnType<typeof createClient> | undefined;

export const initRedis = async () => {
    if (!config.redisUrl) {
    console.warn("No Redis URL found, skipping Redis init.");
    return;
  }
  
  redisClient = createClient({ url: config.redisUrl });
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect to Redis", err);
  }
};

export const getCachedHistory = async (sessionId: string) => {
  if (!redisClient?.isOpen) return null;
  try {
    const data = await redisClient.get(`history:${sessionId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Redis get error", e);
    return null;
  }
};

export const cacheHistory = async (sessionId: string, messages: any[]) => {
  if (!redisClient?.isOpen) return;
  try {
    // Expire in 1 hour
    await redisClient.set(`history:${sessionId}`, JSON.stringify(messages), { EX: 3600 });
  } catch (e) {
    console.error("Redis set error", e);
  }
};
