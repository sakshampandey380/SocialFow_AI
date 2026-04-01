import api from "./api";

export async function fetchWorkflows() {
  const { data } = await api.get("/workflows");
  return data;
}

export async function createWorkflow(payload) {
  const { data } = await api.post("/workflows", payload);
  return data;
}

export async function runWorkflow(workflowId) {
  const { data } = await api.post(`/workflows/${workflowId}/run`);
  return data;
}
