import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";
const getContact = () => createAxiosInstance().get("user/contact/branch/kg");
const saveContact = (contact) => {
 const {whatsappUrl, ...request}=contact;
 return createAxiosInstance().put("admin/contact/branch/kg",request,{headers:{Authorization:`Bearer ${Cookies.get("Authorization")}`}});
};
export default {getContact,saveContact};
