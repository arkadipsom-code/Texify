// src/services/api.js

// 1. Grab the root domain dynamically based on where the code is currently running
const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 2. Append the /api structural route prefix cleanly to both environments
const BASE_URL = `${API_ROOT}/api`;

export const api = {
  resumes: {
    // Fetch all resumes for the logged-in user
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Crucial for passing HttpOnly cookies!
      });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      return res.json();
    },

    getOne: async (id) => {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      return res.json();
    },

    create: async (payload) => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Creation failed with status ${res.status}`);
      return res.json();
    },

    update: async (id, payload) => {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Update failed with status ${res.status}`);
      return res.json();
    },

    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/resumes/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Deletion failed with status ${res.status}`);
      return res.json();
    },
  },
};
