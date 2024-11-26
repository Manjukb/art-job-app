import { app } from "./app.js";
import { PORT, REDIS_HOST } from "./config.js";
import { connectToMongoDB } from "./helpers/init_mongodb.js";
import { client } from "./helpers/init_redis.js";

async function startServer() {
  // connect to mongodb
  await connectToMongoDB();

  // connect to redis
  console.log('REDIS_HOST before ', REDIS_HOST  )
  await client.connect();

  // start server
  app.listen(PORT);
  console.log("Server on port 🚀", PORT);
}

startServer();
