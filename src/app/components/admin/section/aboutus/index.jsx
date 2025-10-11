"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import style from "../../../../../../public/assets/css/module/admin/aboutus.module.css";
import AboutService from "@/app/services/AboutService";

function AboutUsAdmin() {
  const [firstContent, setFirstContent] = useState({});
  const [secondContent, setSecondContent] = useState({});
  const [aboutImage, setAboutImage] = useState([]);
  const [stepAbout, setStepAbout] = useState("");
  const [reqAbout, setReqAbout] = useState({
    title: "",
    titleEn: "",
    titleRu: "",
    secondTitle: "",
    secondTitleEn: "",
    secondTitleRu: "",
    description: "",
    descriptionEn: "",
    descriptionRu: "",
    approximatelyProjectsCount: 0,
    approximatelyStaffsCount: 0,
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAboutImage(e.target.files[0]);
      console.log("Seçilen resim:", e.target.files[0]);
    }
  };

  useEffect(() => {
    // First part
    refreshContent("first");

    // Second part
    refreshContent("second");
  }, []);

  const refreshContent = (step) => {
    AboutService.getAboutInfo(step)
      .then((response) => {
        if (response.data.status.code === 200) {
          if (step === "first") {
            setFirstContent(response.data.response);
          } else if (step === "second") {
            setSecondContent(response.data.response);
          }
        } else {
          console.log("exception message - ", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went wrong -", error);
      });
  };

  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReqAbout((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    AboutService.addOrUpdateAboutInfo(reqAbout, aboutImage, stepAbout)
      .then((response) => {
        if (response.data.status.code === 200) {
          refreshContent(stepAbout);
        } else console.log("internal exception-", response.data.status.message);
      })
      .catch((error) => {
        console.log("something went worng-", error);
      });
    setOpenModal(false);
  };

  const handleDelete = () => {
    console.log("Silindi!");
    setDeleteConfirm(false);
  };

  return (
    <div className={style.container}>
      {/* ---------- First Container ---------- */}
      <div className={style.subContainer}>
        <h1>First</h1>
        <div className={style.imageWrapper}>
          <Image
            src={
              firstContent?.imageUrl
                ? firstContent.imageUrl
                : "/images/admin/question.png"
            }
            alt="About"
            width={150}
            height={150}
            priority
            className={style.image}
          />
        </div>

        <div className={style.itemsWrapper}>
          <div className={style.itemContainer}>
            <div className={style.locale}>AZ</div>
            <h2>{firstContent.title}</h2>
            <h3>{firstContent.secondTitle}</h3>
            <p>{firstContent.description}</p>
          </div>
          <div className={style.itemContainer}>
            <div className={style.locale}>EN</div>
            <h2>{firstContent.titleEn}</h2>
            <h3>{firstContent.secondTitleEn}</h3>
            <p>{firstContent.descriptionEn}</p>
          </div>
          <div className={style.itemContainer}>
            <div className={style.locale}>RU</div>
            <h2>{firstContent.titleRu}</h2>
            <h3>{firstContent.secondTitleRu}</h3>
            <p>{firstContent.descriptionRu}</p>
          </div>
          <p>
            Completed Project Count {firstContent.approximatelyProjectsCount}+
          </p>
        </div>
        <button
          onClick={() => {
            setOpenModal(true);
            setStepAbout("first");
          }}
        >
          Change or Add
        </button>
        <button
          onClick={() => {
            setDeleteConfirm(true);
            setStepAbout("first");
          }}
        >
          Delete
        </button>
      </div>

      {/* ---------- Second Container (aynı mantık) ---------- */}
      <div className={style.subContainer}>
        <h1>Second</h1>
        <div className={style.imageWrapper}>
          <Image
            src={
              secondContent?.imageUrl
                ? `http://localhost:8080/geototal/user/image/${secondContent.imageUrl}`
                : "/images/admin/question.png"
            }
            alt="About"
            width={150}
            height={150}
            priority
            className={style.image}
          />
        </div>

        <div className={style.itemsWrapper}>
          <div className={style.itemContainer}>
            <div className={style.locale}>AZ</div>
            <h2>{secondContent.title}</h2>
            <h3>{secondContent.secondTitle}</h3>
            <p>{secondContent.description}</p>
          </div>
          <div className={style.itemContainer}>
            <div className={style.locale}>EN</div>
            <h2>{secondContent.titleEn}</h2>
            <h3>{secondContent.secondTitleEn}</h3>
            <p>{secondContent.descriptionEn}</p>
          </div>
          <div className={style.itemContainer}>
            <div className={style.locale}>RU</div>
            <h2>{secondContent.titleRu}</h2>
            <h3>{secondContent.secondTitleRu}</h3>
            <p>{secondContent.descriptionRu}</p>
          </div>
          <p>Staff Count {secondContent.approximatelyStaffsCount}+</p>
        </div>
        <button
          onClick={() => {
            setOpenModal(true);
            setStepAbout("second");
          }}
        >
          Change or Add
        </button>
        <button
          onClick={() => {
            setDeleteConfirm(true);
            setStepAbout("second");
          }}
        >
          Delete
        </button>
      </div>

      {/* ---------- Modal ---------- */}
      {openModal && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h2>Düzenle / Ekle</h2>
            <input
              name="title"
              placeholder="Title (AZ)"
              value={reqAbout.title}
              onChange={handleInputChange}
            />
            <input
              name="titleEn"
              placeholder="Title (EN)"
              value={reqAbout.titleEn}
              onChange={handleInputChange}
            />
            <input
              name="titleRu"
              placeholder="Title (RU)"
              value={reqAbout.titleRu}
              onChange={handleInputChange}
            />
            {/* Second Title */}
            <input
              name="secondTitle"
              placeholder="Second Title (AZ)"
              value={reqAbout.secondTitle}
              onChange={handleInputChange}
            />
            <input
              name="secondTitleEn"
              placeholder="Second Title (EN)"
              value={reqAbout.secondTitleEn}
              onChange={handleInputChange}
            />
            <input
              name="secondTitleRu"
              placeholder="Second Title (RU)"
              value={reqAbout.secondTitleRu}
              onChange={handleInputChange}
            />
            {/* Description */}
            <textarea
              name="description"
              placeholder="Description (AZ)"
              value={reqAbout.description}
              onChange={handleInputChange}
            />
            <textarea
              name="descriptionEn"
              placeholder="Description (EN)"
              value={reqAbout.descriptionEn}
              onChange={handleInputChange}
            />
            <textarea
              name="descriptionRu"
              placeholder="Description (RU)"
              value={reqAbout.descriptionRu}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name={
                stepAbout === "first"
                  ? "approximatelyProjectsCount"
                  : "approximatelyStaffsCount"
              }
              value={
                stepAbout === "first"
                  ? reqAbout.approximatelyProjectsCount || ""
                  : reqAbout.approximatelyStaffsCount || ""
              }
              onChange={(e) =>
                setReqAbout((prev) => ({
                  ...prev,
                  [stepAbout === "first"
                    ? "approximatelyProjectsCount"
                    : "approximatelyStaffsCount"]: e.target.value.slice(0, 10), // max 10 basamak
                }))
              }
              min={0}
              max={9999999999} // 10 basamak sınırı
              step={1}
            />
            <input
              type="file"
              accept="image/*"
              id="firstImageInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            {/* Buton olarak görünmesi */}
            <label htmlFor="firstImageInput" className={style.imageButton}>
              {firstContent?.imageUrl || aboutImage ? "Change" : "Add"}
            </label>
            <button onClick={handleSubmit}>Kaydet</button>
            <button onClick={() => setOpenModal(false)}>Kapat</button>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <p>Emin misiniz?</p>
            <button onClick={handleDelete(stepAbout)}>Evet</button>
            <button onClick={() => setDeleteConfirm(false)}>Hayır</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutUsAdmin;
