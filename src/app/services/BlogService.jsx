import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";
const getBlogs = () => createAxiosInstance().get("admin/blog/list", {headers:{Authorization:`Bearer ${Cookies.get("Authorization")}`}});
const saveBlog = (blog, image, id = 0) => {
  const form = new FormData();
  form.append("reqBlog", JSON.stringify(blog));
  if (image) form.append("certificateImage", image);
  return createAxiosInstance().put(`admin/addOrUpdate/blog/${id}`, form, {
    headers: {"Content-Type":"multipart/form-data",Authorization: `Bearer ${Cookies.get("Authorization")}`}
  });
};
const uploadInlineImage = file => {
  const form = new FormData(); form.append("image",file);
  return createAxiosInstance().post("admin/blog/image",form,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${Cookies.get("Authorization")}`}});
};
export default {getBlogs, saveBlog, uploadInlineImage};
