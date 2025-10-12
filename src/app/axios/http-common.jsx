import axios from "axios";

const createAxiosInstance = () => {
  return axios.create({
    baseURL: 'http://localhost:8080/geototal',
    // baseURL: "https://geototal-backend-e6f32f49f836.herokuapp.com/geototal/",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default createAxiosInstance;