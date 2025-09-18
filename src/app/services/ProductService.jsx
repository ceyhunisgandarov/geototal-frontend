import createAxiosInstance from "@/app/axios/http-common";

const getProducts = () => {
    return createAxiosInstance().get("/user/products");
}

export default {
  getProducts,
};