export const API_BASE_URL = "http://localhost:8080/api";

export async function postRequest<TResponse, TBody>(
  url: string,
  body: TBody,
  signal?: AbortSignal, // Permite cancelar a requisição
): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}
