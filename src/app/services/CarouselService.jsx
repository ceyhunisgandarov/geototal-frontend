import createAxiosInstance from "@/app/axios/http-common";
import Cookies from "js-cookie";

const getCarouselData = () => {
  return createAxiosInstance().get("user/carousel/list");
};

const addOrUpdateCarousel = (reqCarousel, carouselImage, id) => {
  const token = Cookies.get("Authorization");
  const formData = new FormData();
  formData.append("carousel", JSON.stringify(reqCarousel));

  if (carouselImage) {
    formData.append("carouselImage", carouselImage);
  }

  return createAxiosInstance().put(
    `admin/add-or-update/carousel/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export default {
  getCarouselData,
  addOrUpdateCarousel,
};
