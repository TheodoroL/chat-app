import { type FastifyRequest, type FastifyReply } from "fastify";
import { UserModel } from "../models/UserModel.js";
import { GetUserDto, LoginUserDto, RegisterUserDto } from "../dto/userDto.js";
import { comparePassword, hashPassword } from "../utils/bcrypt/index.js";
import { generateJwt } from "../utils/jwt/index.js";

export async function RegisterUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { data, error } = RegisterUserDto.safeParse(req.body);

    if (error) return reply.status(400).send({ error: error.issues });

    const findUser = await UserModel.findOne({ email: data.email });

    if (findUser)
      return reply.status(400).send({ error: "User already exists" });

    data.password = await hashPassword(data.password);

    const user = new UserModel({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    const createToken = generateJwt(user._id.toString());
    await user.save();

    reply.status(200).send({ token: createToken });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
}

export async function LoginUser(req: FastifyRequest, reply: FastifyReply) {
  const { data, error } = LoginUserDto.safeParse(req.body);

  if (error) return reply.status(400).send({ error: error.issues });

  try {
    const findUser = await UserModel.findOne({ email: data.email });

    if (!findUser)
      return reply.status(400).send({ error: "Invalid email or password" });

    const isPasswordValid = await comparePassword(
      data.password,
      findUser.password,
    );

    if (!isPasswordValid)
      return reply.status(400).send({ error: "Invalid email or password" });

    const createToken = generateJwt(findUser._id.toString());

    reply.status(200).send({ token: createToken });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
}

export async function GetUser(req: FastifyRequest, reply: FastifyReply) {
  const { data, error } = GetUserDto.safeParse(req.params);

  if (error) return reply.status(400).send({ error: error.issues });

  try {
    const findUser = await UserModel.findById(data.id).select("-password");

    if (!findUser) return reply.status(404).send({ error: "User not found" });

    reply.status(200).send({ user: findUser });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
}

export async function getAllUsers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await UserModel.find().select("-password");
    reply.status(200).send({ users });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
}
