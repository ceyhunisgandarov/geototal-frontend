import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getCertificateList = () => {
  return createAxiosInstance().get("user/certificate/list");
};

const addOrUpdateCertificate = (requestBody, image, id) => {
  const updateId = id ?? 0;
  const token = Cookies.get("Authorization");

  const formData = new FormData();
  formData.append("reqCertificate", JSON.stringify(requestBody));

  if (image) {
    formData.append("certificateImage", image);
  }

  return createAxiosInstance().put(
    `admin/addOrUpdate/certificate/${updateId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

const deleteCertificate = (id) => {
  const token = Cookies.get("Authorization");
  console.log(token)
  return createAxiosInstance().delete(
    `admin/delete/certificate/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default {
  getCertificateList,
  addOrUpdateCertificate,
  deleteCertificate,
};
