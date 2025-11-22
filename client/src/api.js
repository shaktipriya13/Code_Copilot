import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export async function fetchLanguages() {
  const res = await api.get("/api/languages");
  return res.data;
}

export async function postGenerate(body) {
  const res = await api.post("/api/generate", body);
  return res.data;
}

export async function fetchHistory(page = 1, limit = 10) {
  const res = await api.get("/api/history", { params: { page, limit } });
  return res.data;
}

export default api;
