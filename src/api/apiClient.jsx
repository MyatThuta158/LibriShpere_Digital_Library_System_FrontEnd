import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// const token = localStorage.getItem("token");
const token = Cookies.get("token");

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    if (!(config.data instanceof FormData)) {
      config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };
    } else {
      config.headers = {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };
    }

    // console.log(token);
    // Return the modified config
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
