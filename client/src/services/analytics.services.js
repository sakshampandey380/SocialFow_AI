import api from "./api";

export async function fetchAnalyticsDashboard() {
  const { data } = await api.get("/analytics/dashboard");
  return data;
}
