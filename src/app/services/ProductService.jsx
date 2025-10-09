import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getProducts = () => {
  return createAxiosInstance().get("user/products");
};

const addOrUpdateProduct = (
  reqProduct,
  imageFiles,
  pdfFile,
  oldImagePath,
  updateId
) => {
  console.log(reqProduct, "- reqproduct");
  const token = Cookies.get("Authorization");
  const formData = new FormData();
  formData.append("product", JSON.stringify(reqProduct));
  if (pdfFile) {
    formData.append("pdf", pdfFile);
  }
  formData.append("oldImageLinks", oldImagePath.join(","));
  imageFiles.forEach((img) => {
    if (img.file) {
      formData.append("images", img.file);
    }
  });

  return createAxiosInstance().put(`admin/add/product/${updateId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const getProduct = (id) => {
  return createAxiosInstance().get(`user/product/${id}`);
};

const deleteProduct = (id) => {
  const token = Cookies.get("Authorization");

  return createAxiosInstance().put(
    `admin/product/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default {
  getProducts,
  addOrUpdateProduct,
  getProduct,
  deleteProduct
};
