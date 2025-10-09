import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getAboutInfo = (step) => {
  return createAxiosInstance().get(`user/about/${step}`);
};

const addOrUpdateAboutInfo = (reqAbout, aboutImage, step) => {
  console.log(step);
  const token = Cookies.get("Authorization");
  const formData = new FormData();
  formData.append("about", JSON.stringify(reqAbout));

  if (aboutImage) {
    formData.append("aboutImage", aboutImage);
  }

  return createAxiosInstance().put(`admin/about-info/${step}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export default {
  getAboutInfo,
  addOrUpdateAboutInfo,
};
