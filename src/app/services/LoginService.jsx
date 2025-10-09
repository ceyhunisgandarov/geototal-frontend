import createAxiosInstance from "@/app/axios/http-common";

const login = (reqAuth) => {
  return createAxiosInstance().post("user/login", reqAuth);
};

const getAdmin = (token) => {
    return createAxiosInstance().post("/admin/me",{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}

export default {
  login,
  getAdmin
};