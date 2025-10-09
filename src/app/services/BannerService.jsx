import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getBanner = (name) => {
  return createAxiosInstance().get(`user/header/${name}`);
};

const addOrUpdateBanner = (reqBanner, bannerImage, id) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();
  formData.append("header", JSON.stringify(reqBanner));

  let updateId=0;

  if(id!=null) {
    updateId=id;
  }

  if (bannerImage) {
    formData.append("headerImage", bannerImage);
  }

  return createAxiosInstance().put(
    `admin/add-or-update/header/${updateId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default {
  getBanner,
  addOrUpdateBanner,
};
