import fastify from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";

import { env } from "./env.js";
import { registerUserRoutes } from "./routes/user.route.js";
import registerChatRoutes from "./routes/chat.route.js";

const app = fastify({ logger: env.isDev });

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(registerUserRoutes, { prefix: "/api/users" });
app.register(registerChatRoutes, { prefix: "/api/chats" });

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on port ${env.PORT}`);
});
