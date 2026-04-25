import type { FastifyInstance } from "fastify";
import {
  LoginUser,
  RegisterUser,
  GetUser,
  getAllUsers,
} from "../controller/UserController.js";

export async function registerUserRoutes(app: FastifyInstance) {
  app.post("/register", RegisterUser);
  app.post("/login", LoginUser);
  app.get("/find/:id", GetUser);
  app.get("/", getAllUsers);
}
