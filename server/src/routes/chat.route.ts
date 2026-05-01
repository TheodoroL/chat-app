import type { FastifyInstance } from "fastify";
import {
  createChat,
  getUserChats,
  FindChat,
} from "../controller/ChatController.js";
export default function registerChatRoutes(app: FastifyInstance) {
  app.post("/create", createChat);
  app.get("/user/:userId", getUserChats);
  app.get("/find/:firstId/:secondId", FindChat);
}
