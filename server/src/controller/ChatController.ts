import type { FastifyRequest, FastifyReply } from "fastify";
import { chatModel } from "../models/ChatModel.js";
import { createChatSchema, getUserChatsSchema } from "../dto/chatDto.js";

export async function createChat(req: FastifyRequest, reply: FastifyReply) {
  const { data, error } = createChatSchema.safeParse(req.body);
  if (error) return reply.status(400).send({ error: error.issues });

  try {
    const chat = await chatModel.findOne({
      members: { $all: [data.firstId, data.secondId] },
    });

    if (chat) return reply.status(200).send(chat);

    const newChat = new chatModel({
      members: [data.firstId, data.secondId],
    });
    await newChat.save();
    return reply.status(201).send(newChat);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function getUserChats(req: FastifyRequest, reply: FastifyReply) {
  const { data, error } = getUserChatsSchema.safeParse(req.params);
  if (error) return reply.status(400).send({ error: error.issues });

  try {
    const chats = await chatModel.find({ members: data.userId });
    return reply.status(200).send(chats);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
}

export async function FindChat(req: FastifyRequest, reply: FastifyReply) {
  const { data, error } = createChatSchema.safeParse(req.params);
  if (error) return reply.status(400).send({ error: error.issues });

  try {
    const chat = await chatModel.find({
      members: { $all: [data.firstId, data.secondId] },
    });
    return reply.status(200).send(chat);
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
}
