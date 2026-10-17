"use client";
import Image from "next/image";
import style from "../../../../../../public/assets/css/module/admin/carousel.module.css";
import { useEffect, useState } from "react";
import CarouselService from "@/app/services/CarouselService";


function AdminCarousel() {
  const [carouselData, setCarouselData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselId, setCarouselId] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    link: "",
    slogan: "",
    sloganEn: "",
    sloganRu: "",
    sloganKy: "",
    title: "",
    description: "",
    titleEn: "",
    titleRu: "",
    titleKy: "",
    descriptionEn: "",
    descriptionRu: "",
    descriptionKy: "",
  });

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [saveError, setSaveError] = useState("");

  const [carouselImage, setCarouselImage] = useState(null);

  useEffect(() => {
    fetchCarousel();
  }, []);

  const fetchCarousel = () => {
    CarouselService.getCarouselData()
      .then((response) => {
        setCarouselData(response.data.response || []);
      })
      .catch((error) => console.log("something went wrong-", error));
  };

  const filledData = Array.from({ length: Math.max(4, carouselData.length) }, (_, index) => {
    return carouselData[index]
      ? carouselData[index]
      : {
          id: `default-${index}`,
          imageLink: null,
          title: null,
          description: null,
          titleEn: null,
          titleRu: null,
          titleKy: null,
          descriptionEn: null,
          descriptionRu: null,
          descriptionKy: null,
        };
  });

  const handleDelete = async (id) => {
    if (deletingId !== null || !confirm("Bu slaydı silmək istəyirsiniz?")) return;
    setDeletingId(id);
    setDeleteError("");
    try {
      const { data } = await CarouselService.deleteCarousel(id);
      if (data?.status?.code !== 200) {
        setDeleteError(data?.status?.message || "Slaydı silmək mümkün olmadı.");
        return;
      }
      setCarouselData((items) => items.filter((item) => item.id !== id));
    } catch {
      setDeleteError("Slaydı silmək mümkün olmadı. Yenidən cəhd edin.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenModal = (item, id) => {
    const isNew = !item || item.id.toString().startsWith("default");

    setCurrentItem(item || null);
    setFormData({
      link: isNew ? "" : item.link ?? "",
      slogan: isNew ? "" : item.slogan ?? "",
      sloganEn: isNew ? "" : item.sloganEn ?? "",
      sloganRu: isNew ? "" : item.sloganRu ?? "",
      sloganKy: isNew ? "" : item.sloganKy ?? "",
      title: isNew ? "" : item.title || "",
      description: isNew ? "" : item.description || "",
      titleEn: isNew ? "" : item.titleEn || "",
      titleRu: isNew ? "" : item.titleRu || "",
      titleKy: isNew ? "" : item.titleKy || "",
      descriptionEn: isNew ? "" : item.descriptionEn || "",
      descriptionRu: isNew ? "" : item.descriptionRu || "",
      descriptionKy: isNew ? "" : item.descriptionKy || "",
    });
    setSaveError("");
    setCarouselImage(null); // Modal açıldığında eski resim sıfırlanır
    setCarouselId(isNew ? 0 : item.id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        // 1MB = 1024*1024 byte
        alert("Resim boyutu en fazla 5MB olabilir!");
        return;
      }
      setCarouselImage(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setSaveError("");
    try {
      const { data } = await CarouselService.addOrUpdateCarousel(formData, carouselImage, carouselId);
      if (data?.status?.code !== 200) {
        setSaveError(data?.status?.message || "Slaydı saxlamaq mümkün olmadı.");
        return;
      }
      fetchCarousel();
      setModalOpen(false);
    } catch (error) {
      setSaveError(error?.response?.data?.status?.message || error?.response?.data?.message || "Serverlə əlaqə alınmadı. İnternet bağlantısını yoxlayıb yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      {deleteError && <p role="alert">{deleteError}</p>}
      <div className={style.containerSlide}>
        {filledData.map((item, idx) => (
          <div key={idx} className={style.cardCarousel}>
            <div className={style.cardCarouselImage}>
              <Image
                src={
                  item.imageLink
                    ? item.imageLink
                    : "/images/admin/question.png"
                }
                width={300}
                height={300}
                priority
                alt={item.title || "carousel"}
                className={style.bannerImage}
              />
            </div>

            <div className={style.cardCarouselTitle}>
              {item.title ? item.title : "Empty"}
            </div>
            <div className={style.cardCarouselDescription}>
              {item.description ? item.description : "Empty"}
            </div>

            <div style={{ marginTop: "10px" }}>
              {item.title ? (
                <>
                  <button onClick={() => handleOpenModal(item, idx)}>
                    Edit
                  </button>
                  <button disabled={deletingId !== null} onClick={() => handleDelete(item.id)}>
                    {deletingId === item.id ? "Silinir…" : "Delete"}
                  </button>
                </>
              ) : (
                <button onClick={() => handleOpenModal(item, idx)}>Add</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <h2>{currentItem?.title ? "Edit Carousel" : "New Carousel"}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Choose Image:</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              </div>

              <div className={style.formGroup}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="title">Title</label>
              </div>

              <div className={style.formGroup}>
                <input
                  type="text"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                />
                <label htmlFor="title">Title EN</label>
              </div>

              <div className={style.formGroup}>
                <input
                  type="text"
                  name="titleRu"
                  value={formData.titleRu}
                  onChange={handleChange}
                />
                <label htmlFor="title">Title RU</label>
              </div>

              <div className={style.formGroup}>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="description">Description</label>
              </div>

              <div className={style.formGroup}>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleChange}
                />

                <label htmlFor="description">Description EN</label>
              </div>

              <div className={style.formGroup}>
                <textarea
                  name="descriptionRu"
                  value={formData.descriptionRu}
                  onChange={handleChange}
                />
                <label htmlFor="description">Description RU</label>
              </div>

              <div className={style.formGroup}>
                <input name="titleKy" value={formData.titleKy} onChange={handleChange} />
                <label>Title KY</label>
              </div>
              <div className={style.formGroup}>
                <textarea name="descriptionKy" value={formData.descriptionKy} onChange={handleChange} />
                <label>Description KY</label>
              </div>
              {[['slogan', 'AZ'], ['sloganEn', 'EN'], ['sloganRu', 'RU'], ['sloganKy', 'KY']].map(([name, language]) => (
                <div className={style.formGroup} key={name}>
                  <input id={name} name={name} value={formData[name]} onChange={handleChange} />
                  <label htmlFor={name}>Slogan {language}</label>
                </div>
              ))}

              <div className={style.formGroup}>
                <label htmlFor="carousel-link">Link (istəyə bağlı)</label>
                <input id="carousel-link" name="link" value={formData.link}
                  onChange={handleChange} placeholder="services/geodesy və ya https://example.com" />
                <small>Saytdaxili səhifə ünvanı və ya tam https:// linki. Boş saxlasanız keçid düyməsi görünməyəcək.</small>
              </div>
              {saveError && <p role="alert" style={{color: "#b91c1c", margin: "8px 0"}}>{saveError}</p>}
              <button type="submit" disabled={loading}>Save</button>
              <button type="button" disabled={loading} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCarousel;
