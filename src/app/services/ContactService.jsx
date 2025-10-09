import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getContact = () => {
  return createAxiosInstance().get("user/contact-info/get");
};

const addOrUpdateContact = (reqContact) => {
  const token = Cookies.get("Authorization");
  return createAxiosInstance().put(
    "admin/add-or-update/contact-info",
    reqContact,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export default {
  getContact,
  addOrUpdateContact,
};
