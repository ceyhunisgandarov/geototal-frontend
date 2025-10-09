"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import style from "../../../../../../public/assets/css/module/admin/banner.module.css";
import BannerService from "@/app/services/BannerService";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

function BannerAdmin({ page }) {
  const [dbImage, setDbImage] = useState("/images/admin/question.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqBanner, setReqBanner] = useState({ title: "" });
  const [bannerImage, setBannerImage] = useState(null);
  const [id, setId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const buttonText =
    dbImage && dbImage !== "/images/admin/question.png" ? "Change" : "Add";

  useEffect(() => {
    refreshBanner();
  }, []);

  const refreshBanner = () => {
    BannerService.getBanner(page)
      .then((response) => {
        if (response.data.status.code === 200) {
          const imageUrl = response.data.response.imageUrl;
          setDbImage(`${BASE_IMAGE_URL + imageUrl}`);
          setId(response.data.response.id);
          setReqBanner({ title: response.data.response.title || "" });
        } else {
          setDbImage("/images/admin/question.png");
          setId(null);
        }
      })
      .catch((error) => {
        console.log("something went wrong - ", error);
        setDbImage("/images/admin/question.png");
        setId(null);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerImage || !reqBanner.title) {
      setErrorMessage("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      const response = await BannerService.addOrUpdateBanner(
        reqBanner,
        bannerImage,
        id
      );
      if (response.data.status.code === 200) {
        setId(response.data.response.id);
        setIsModalOpen(false);
        refreshBanner();
      } else {
        setErrorMessage(response.data.status.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Internal error");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.imageWrapper}>
        <Image src={dbImage} alt="banner" fill className={style.image} />
        <button
          className={style.overlayButton}
          onClick={() => setIsModalOpen(true)}
        >
          {buttonText}
        </button>
      </div>

      {isModalOpen && (
        <div className={style.modalBackdrop}>
          <div className={style.modal}>
            <h2>{buttonText} Banner</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                onChange={(e) => setBannerImage(e.target.files[0])}
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                required
                value={reqBanner.title}
                onChange={(e) =>
                  setReqBanner({ ...reqBanner, title: e.target.value })
                }
              />

              {errorMessage && <p className={style.error}>{errorMessage}</p>}

              <div className={style.modalActions}>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerAdmin;
