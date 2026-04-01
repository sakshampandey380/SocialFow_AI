import api from "./api";

export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

export async function fetchProfile() {
  const { data } = await api.get("/users/me");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.patch("/users/me", payload);
  return data;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
