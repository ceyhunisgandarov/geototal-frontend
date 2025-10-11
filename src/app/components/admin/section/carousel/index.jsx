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
    title: "",
    description: "",
    titleEn: "",
    titleRu: "",
    descriptionEn: "",
    descriptionRu: "",
  });

  const [loading, setLoading] = useState(false);

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

  const filledData = Array.from({ length: 4 }, (_, index) => {
    return carouselData[index]
      ? carouselData[index]
      : {
          id: `default-${index}`,
          imageLink: null,
          title: null,
          description: null,
          titleEn: null,
          titleRu: null,
          descriptionEn: null,
          descriptionRu: null,
        };
  });

  const handleDelete = (id) => {
    CarouselService.deleteCarousel(id)
      .then(() => fetchCarousel())
      .catch((err) => console.log(err));
  };

  const handleOpenModal = (item, id) => {
    const isNew = !item || item.id.toString().startsWith("default");

    setCurrentItem(item || null);
    setFormData({
      title: isNew ? "" : item.title || "",
      description: isNew ? "" : item.description || "",
      titleEn: isNew ? "" : item.titleEn || "",
      titleRu: isNew ? "" : item.titleRu || "",
      descriptionEn: isNew ? "" : item.descriptionEn || "",
      descriptionRu: isNew ? "" : item.descriptionRu || "",
    });
    setCarouselImage(null); // Modal açıldığında eski resim sıfırlanır
    setCarouselId(id + 1);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file && file.size > 1024 * 1024) {
        // 1MB = 1024*1024 byte
        alert("Resim boyutu en fazla 1MB olabilir!");
        return;
      }
      setCarouselImage(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(carouselId);

    CarouselService.addOrUpdateCarousel(formData, carouselImage, carouselId)
      .then(() => {
        fetchCarousel();
        setModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={style.container}>
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
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
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

              <button type="submit">Save</button>
              <button type="button" onClick={() => setModalOpen(false)}>
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
