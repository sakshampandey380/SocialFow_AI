import api from "./api";

export async function generateContent(payload) {
  const { data } = await api.post("/ai/generate", payload);
  return data;
}

export async function fetchAiHistory() {
  const { data } = await api.get("/ai/history");
  return data;
}
