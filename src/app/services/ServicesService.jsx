import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getServices = () => {
  return createAxiosInstance().get(`user/service/get-list`);
};

const getService = (pathName) => {
  return createAxiosInstance().get(`user/service/get/${pathName}`);
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
  if (reqServiceParts) {
    formData.append("serviceParts", JSON.stringify(reqServiceParts));
  }

  // ServicePart resimlerini ekle
  if (servicePartImages && servicePartImages.length > 0) {
    servicePartImages.forEach((file, index) => {
      // Preserve part indices when only some images are replaced.
      formData.append("servicePartImages", file || new Blob([]), file?.name || "unchanged");
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
