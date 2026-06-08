// src/services/api.js
const BASE_URL = "http://localhost:5000/api";

export const api = {
  resumes: {
    // Fetch all resumes for the logged-in user
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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

    // Delete a specific resume template draft
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
