import { createClient } from "redis";
import { REDIS_HOST } from "../config.js";  // Make sure REDIS_HOST is correctly set

console.log(REDIS_HOST, 'REDIS_HOST*************');  // To verify the REDIS_HOST value

// Create a Redis client
export const client = createClient({
  url: 'redis://redis:6379'  // 'redis' as the hostname, no credentials needed
});

// Event listeners for the Redis client
client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("ready", () => {
  console.log("Redis client ready");
});

client.on("error", (err) => {
  console.log("Redis client error:", err.message, REDIS_HOST);
});

client.on("end", () => {
  console.log("Redis client disconnected");
});

// Graceful shutdown when the process receives SIGINT
process.on("SIGINT", () => {
  console.log("Shutting down Redis client...");
  client.quit();  // Close the Redis client connection gracefully
});
