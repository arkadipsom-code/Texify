// src/services/api.js

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = `${API_ROOT}/api`;

// Helper to automatically attach the Bearer token to all data requests
const getHeaders = () => {
  const token = localStorage.getItem("texify_token");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  resumes: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      return res.json();
    },

    getOne: async (id) => {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, {
        method: "GET",
        headers: getHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      return res.json();
    },

    create: async (payload) => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: "POST",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Creation failed with status ${res.status}`);
      return res.json();
    },

    update: async (id, payload) => {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);
      return res.json();
    },

    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Deletion failed with status ${res.status}`);
      return res.json();
    },
  },
};
