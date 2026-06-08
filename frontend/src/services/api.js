// src/services/api.js

// Vite checks your environment variables automatically.
// It will use Render on production, and drop back to your local server when coding at home!
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = {
  resumes: {
    // Fetch all resumes for the logged-in user
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/resumes`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Essential for forwarding HttpOnly session cookies
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
