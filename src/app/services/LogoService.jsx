import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getLogo = () => {
  return createAxiosInstance().get("user/logo");
};

const changeLogo = (reqLogo, file) => {
  const token = Cookies.get("Authorization"); // token al

  const formData = new FormData();
  formData.append("logo", JSON.stringify(reqLogo)); // JSON bilgisi
  if (file) {
    formData.append("image", file); // dosya varsa ekle
  }

  return createAxiosInstance(token).put("admin/logo/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // token ekle
    },
  });
};

export default {
  getLogo,
  changeLogo,
};
