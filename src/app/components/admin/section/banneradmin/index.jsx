"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import style from "../../../../../../public/assets/css/module/admin/banner.module.css";
import { bannerPageKey } from "@/lib/bannerPage";
import BannerService from "@/app/services/BannerService";

function BannerAdmin({ page }) {
  const [dbImage, setDbImage] = useState("/images/admin/question.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageKey = bannerPageKey(page);
  const [bannerImage, setBannerImage] = useState(null);
  const [id, setId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const buttonText =
    dbImage && dbImage !== "/images/admin/question.png" ? "Change" : "Add";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    setErrorMessage("");
    setId(null);
    setDbImage("/images/admin/question.png");
    setIsModalOpen(false);
    setBannerImage(null);
    BannerService.getBanner(pageKey)
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.status?.code === 200 && data.response?.id) {
          setDbImage(data.response.imageUrl || "/images/admin/question.png");
          setId(data.response.id);
        } else if (data?.status?.code !== 404) {
          setLoadFailed(true);
          setErrorMessage(data?.status?.message || "Banner yüklənmədi. Səhifəni yeniləyin.");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setLoadFailed(true);
        setErrorMessage("Banner yüklənmədi. Səhifəni yeniləyin.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pageKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || saving || loadFailed) return;
    if (!bannerImage) {
      setErrorMessage("Lütfen tüm alanları doldurun");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      const response = await BannerService.addOrUpdateBanner(
        { title: pageKey },
        bannerImage,
        id
      );
      if (response.data.status.code === 200) {
        setId(response.data.response.id);
        setIsModalOpen(false);
        setDbImage(response.data.response.imageUrl);
        setBannerImage(null);
      } else {
        setErrorMessage(response.data.status.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Banner saxlanmadı. Yenidən cəhd edin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={style.container}>
      {errorMessage && <p role="alert" className={style.error}>{errorMessage}</p>}
      <div className={style.imageWrapper}>
        <Image src={dbImage} alt="banner" fill className={style.image} />
        <button
          className={style.overlayButton}
          disabled={loading || loadFailed}
          onClick={() => { setBannerImage(null); setErrorMessage(""); setIsModalOpen(true); }}
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
              <div className={style.modalActions}>
                <button type="submit" disabled={saving}>{saving ? "Saxlanır…" : "Submit"}</button>
                <button type="button" disabled={saving} onClick={() => setIsModalOpen(false)}>
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
