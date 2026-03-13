import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  timeout: 60000,
  // Do NOT set a default Content-Type — let Axios/browser decide per request
  // (required for multipart/form-data uploads to include the correct boundary)
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ?? error.message ?? "An error occurred";
    return Promise.reject(new Error(String(message)));
  }
);

export default apiClient;
