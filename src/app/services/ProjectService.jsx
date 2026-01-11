import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getProjects = () => {
  return createAxiosInstance().get("user/project/list");
};

const addOrUpdateProject = (reqProject, imageFile, path) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();

  formData.append("reqProject", JSON.stringify(reqProject));

  if (imageFile) {
    formData.append("projectImage", imageFile);
  }

  return createAxiosInstance().put(
    `admin/addOrUpdate/project/${path}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const getProject = (path) => {
  return createAxiosInstance().get(`user/project/${path}`);
};

const deleteProject = (path) => {
  const token = Cookies.get("Authorization");

  return createAxiosInstance().put(
    `admin/project/delete/${path}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default {
  getProjects,
  addOrUpdateProject,
  getProject,
  deleteProject,
};
