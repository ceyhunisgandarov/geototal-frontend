import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getServices = () => {
  return createAxiosInstance().get(`user/service/get-list`);
};

const getService = (id) => {
  return createAxiosInstance().get(`user/service/get/${id}`);
};


const addOrUpdateService = (reqService, serviceImage, reqServiceParts, servicePartImages, id) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();

  // Service objesini JSON olarak ekle
  formData.append("service", JSON.stringify(reqService));

  // Service image ekle
  if (serviceImage) {
    formData.append("serviceImage", serviceImage);
  }

  // ServiceParts JSON olarak ekle
  if (reqServiceParts && reqServiceParts.length > 0) {
    formData.append("serviceParts", JSON.stringify(reqServiceParts));
  }

  // ServicePart resimlerini ekle
  if (servicePartImages && servicePartImages.length > 0) {
    servicePartImages.forEach((file, index) => {
      if (file) formData.append(`servicePartImages`, file);
    });
  }

  // ID varsa update, yoksa add
  const url = id ? `admin/add-or-update/service/${id}` : `admin/add-or-update/service/0`;

  return createAxiosInstance().put(url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteService = (id) => {
//   const token = Cookies.get("Authorization");

//   return createAxiosInstance().delete(
//     `admin/delete/member/${id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
};

export default {
  getServices,
  getService,
  addOrUpdateService,
  deleteService,
};
