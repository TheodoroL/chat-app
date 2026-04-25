import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    email: {
      required: true,
      type: String,
      minLength: 3,
      maxLength: 200,
      unique: true,
    },
    password: {
      required: true,
      type: String,
      minLength: 8,
      maxLength: 1024,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model("User", userSchema);
