import axios from "axios";

const createAxiosInstance = () => {
  return axios.create({
    baseURL: "http://localhost:8080/geototal/",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default createAxiosInstance;