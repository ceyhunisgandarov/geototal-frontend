import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getReferenceList = () => {
  return createAxiosInstance().get("user/reference/list");
};

const addReference = (image) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();

  if (image) {
    formData.append("referenceImage", image);
  }

  return createAxiosInstance().post(
    `admin/add/reference`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const deleteReference = (id) => {
  const token = Cookies.get("Authorization");

  return createAxiosInstance().delete(`admin/delete/reference/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  getReferenceList,
  addReference,
  deleteReference
};
