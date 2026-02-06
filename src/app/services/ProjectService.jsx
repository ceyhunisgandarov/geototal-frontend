import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getProjects = () => {
  return createAxiosInstance().get("user/project/list");
};

const addOrUpdateProject = (reqProject, imageFile, path, referenceLetter) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();

  const { id, imageUrl, ...cleanReqProject } = reqProject;
  formData.append("reqProject", JSON.stringify(cleanReqProject));

  if (imageFile) {
    formData.append("projectImage", imageFile);
  }

  if (referenceLetter) {
    formData.append("referenceLetter", referenceLetter);
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

const deleteProject = (id) => {
  const token = Cookies.get("Authorization");

  return createAxiosInstance().delete(`admin/delete/project/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
  getProjects,
  addOrUpdateProject,
  getProject,
  deleteProject,
};
