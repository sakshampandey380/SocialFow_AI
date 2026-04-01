import api from "./api";

export async function fetchPosts() {
  const { data } = await api.get("/posts");
  return data;
}

export async function fetchCalendarItems() {
  const { data } = await api.get("/posts/calendar");
  return data;
}

export async function createPost(payload) {
  const { data } = await api.post("/posts", payload);
  return data;
}

export async function updatePost(postId, payload) {
  const { data } = await api.patch(`/posts/${postId}`, payload);
  return data;
}

export async function deletePost(postId) {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
}

export async function publishPost(postId) {
  const { data } = await api.post(`/posts/${postId}/publish`);
  return data;
}

export async function uploadMedia(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/posts/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
