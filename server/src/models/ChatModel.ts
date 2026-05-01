import { model, Schema } from "mongoose";

const chatSchema = new Schema(
  {
    members: Array,
  },
  { timestamps: true },
);

export const chatModel = model("Chat", chatSchema);
