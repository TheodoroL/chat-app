import { z } from "zod";

export const createChatSchema = z.object({
  firstId: z.string(),
  secondId: z.string(),
});

export const getUserChatsSchema = z.object({
  userId: z.string(),
});
