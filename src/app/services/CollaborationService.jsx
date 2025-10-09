import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getCollaborationList = () => {
  return createAxiosInstance().get("user/collaboration/list");
};

const addOrUpdate = (reqLogo, image, id) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();
  formData.append("collaboration", JSON.stringify(reqLogo));

  if (image) {
    formData.append("collaborationImage", image);
  }

  return createAxiosInstance().put(
    `admin/add-or-update/collaboration/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const deleteLogo = (id) => {
  const token = Cookies.get("Authorization");

  return createAxiosInstance().put(
    `admin/delete/collaboration/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default {
  getCollaborationList,
  addOrUpdate,
  deleteLogo
};
