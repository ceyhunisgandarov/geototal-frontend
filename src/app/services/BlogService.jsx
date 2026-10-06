import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";
const getBlogs = () => createAxiosInstance().get("user/blog/list");
const saveBlog = (blog, image, id = 0) => {
  const form = new FormData();
  form.append("reqBlog", JSON.stringify(blog));
  if (image) form.append("certificateImage", image);
  return createAxiosInstance().put(`admin/addOrUpdate/blog/${id}`, form, {
    headers: {Authorization: `Bearer ${Cookies.get("Authorization")}`}
  });
};
export default {getBlogs, saveBlog};
