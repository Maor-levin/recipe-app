import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses (token expired or invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 error and not a login/register/delete endpoint
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // Don't logout on login/register/delete account/delete recipe password failures
      if (
        !url.includes("/auth/login") &&
        !url.includes("/auth/register") &&
        !url.includes("/users/me") &&
        !(url.includes("/recipes/") && error.config?.method === "delete")
      ) {
        // Token expired or invalid - clear auth and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        // Store logout message to show on redirect
        sessionStorage.setItem(
          "logoutMessage",
          "Your session has expired. Please log in again."
        );
        // Redirect to home page
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) =>
    api.post("/auth/login", {
      username_or_email: credentials.username,
      password: credentials.password,
    }),
};

// User API
export const userAPI = {
  getMe: () => api.get("/users/me"),
  deleteAccount: (password) => api.delete("/users/me", { data: { password } }),
};

// Recipe API
export const recipeAPI = {
  search: (query = "") => api.get("/recipes/", { params: { q: query } }),
  getById: (id) => api.get(`/recipes/${id}`),
  getByUser: (userId) => api.get(`/recipes/by-user/${userId}`),
  create: (recipeData) => api.post("/recipes/", recipeData),
  update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  delete: (id, password) =>
    api.delete(`/recipes/${id}`, { data: { password } }),
};

// Comment API
export const commentAPI = {
  getForRecipe: (recipeId) => api.get(`/comments/recipe/${recipeId}`),
  create: (recipeId, content) =>
    api.post(`/comments/recipe/${recipeId}`, { content }),
  update: (commentId, content) =>
    api.put(`/comments/${commentId}`, { content }),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

// Favorite API
export const favoriteAPI = {
  getMyFavorites: () => api.get("/favorites/my-favorites"),
  add: (recipeId) => api.post(`/favorites/recipe/${recipeId}`),
  remove: (recipeId) => api.delete(`/favorites/recipe/${recipeId}`),
  check: (recipeId) => api.get(`/favorites/check/${recipeId}`),
};

// Note API
export const noteAPI = {
  getForRecipe: (recipeId) => api.get(`/notes/recipe/${recipeId}`),
  getMyNotes: () => api.get("/notes/my-notes"),
  saveOrUpdate: (recipeId, content) =>
    api.put(`/notes/recipe/${recipeId}`, { content }),
  delete: (recipeId) => api.delete(`/notes/recipe/${recipeId}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/upload/image", formData);
  },
  deleteImage: (publicId) => api.delete(`/api/upload/image/${publicId}`),
};

export default api;
