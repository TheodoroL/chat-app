import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("*", "not-found.tsx"),
  index("routes/chat.tsx"),
  route("login", "routes/Login.tsx"),
  route("register", "routes/Register.tsx"),
] satisfies RouteConfig;
