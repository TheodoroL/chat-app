import { redirect } from "react-router";

export function meta() {
  return [
    { title: "Chat" },
    { name: "description", content: "This is the chat page." },
  ];
}

export async function loader({ request }: { request: Request }) {
  const cookieHeader = request.headers.get("Cookie");
  const token = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("authToken="))
    ?.split("=")[1];

  if (!token) {
    return redirect("/login");
  }

  return { token };
}

export default function Chat() {
  return (
    <div>
      <h1>Chat</h1>
    </div>
  );
}
