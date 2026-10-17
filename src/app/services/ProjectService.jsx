import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getProjects = () => {
  return createAxiosInstance().get("user/project/list");
};

const addOrUpdateProject = (reqProject, imageFile, projectId, referenceLetter) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();

  if (imageFile) {
    formData.append("projectImage", imageFile);
  }

  if (referenceLetter) {
    formData.append("referenceLetter", referenceLetter);
  }

  const { id, imageUrl, referenceLetter: existingLetter, ...cleanReqProject } = reqProject;
  formData.append("reqProject", JSON.stringify(cleanReqProject));

  return createAxiosInstance().put(
    `admin/projects/${projectId ?? 0}`,
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
