import axios from "axios";

const createAxiosInstance = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL || !baseURL.trim()) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required");
  }

  return axios.create({
    baseURL: baseURL.trim(),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default createAxiosInstance;