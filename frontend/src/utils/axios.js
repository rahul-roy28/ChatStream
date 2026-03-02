import axios from "axios";
import useChatStore from "../store/useChatStore";

const axiosInstance = axios.create({
  baseURL: "https://chatstream-backend-gbmf.onrender.com",
});

axiosInstance.interceptors.request.use((config) => {
  const token = useChatStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
