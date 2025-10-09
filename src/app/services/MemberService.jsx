import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getMembers = () => {
  return createAxiosInstance().get(`user/member/list`);
};

const addOrUpdatMember = (reqMembers, memberImage, id) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();
  formData.append("member", JSON.stringify(reqMembers));
  let updateId = 0;
  if (id !== null) {
    updateId = id;
  }
  if (memberImage) {
    formData.append("memberImage", memberImage);
  }

  return createAxiosInstance().put(
    `admin/add-or-update/member/${updateId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const deleteMember = (id) => {
  const token = Cookies.get("Authorization");

  return createAxiosInstance().delete(
    `admin/delete/member/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default {
  getMembers,
  addOrUpdatMember,
  deleteMember,
};
