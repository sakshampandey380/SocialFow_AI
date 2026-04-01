import api from "./api";

export async function fetchSocialAccounts() {
  const { data } = await api.get("/social/accounts");
  return data;
}

export async function fetchOAuthUrl(platform) {
  const { data } = await api.get(`/social/oauth/${platform}`);
  return data;
}

export async function connectAccount(payload) {
  const { data } = await api.post("/social/connect", payload);
  return data;
}

export async function disconnectAccount(accountId) {
  const { data } = await api.delete(`/social/accounts/${accountId}`);
  return data;
}
