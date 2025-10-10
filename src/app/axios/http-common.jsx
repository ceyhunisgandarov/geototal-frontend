import axios from "axios";

const createAxiosInstance = (token) => {
  return axios.create({
    baseUrl: "https://geototal-backend-e6f32f49f836.herokuapp.com/geototal/",
    // baseURL: "http://192.168.0.114:8080/geototal/",
    // baseURL: "http://localhost:8080/geototal/",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default createAxiosInstance;