import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const AccessToken = "";

    if (AccessToken) {
      config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (payload) => {
  try {
    const response = await api.post("/api/login", payload);
    return response;
  } catch (error) {
    throw error;
  }
};
