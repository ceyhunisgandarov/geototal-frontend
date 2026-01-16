import axios from "axios";

const createAxiosInstance = () => {
  return axios.create({
    baseURL: "https://mighty-forest-00765-fe413afa7e94.herokuapp.com/geototal/",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default createAxiosInstance;