"use client";
import { useEffect, useState } from "react";
import style from "../../../../../../public/assets/css/module/admin/collaboration.module.css";
import Image from "next/image";
import CollaborationService from "@/app/services/CollaborationService";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

function CollaborationEditSection() {
  const [logos, setLogos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    refreshLogos();
  }, []);

  const refreshLogos = () => {
    CollaborationService.getCollaborationList()
      .then((response) => {
        if (response.data.status.code === 200) {
          setLogos(response.data.response);
        } else {
          setLogos([]);
        }
      })
      .catch((error) => {
        console.log("something went wrong - ", error);
      });
  };

  const handleDelete = (id) => {
    CollaborationService.deleteLogo(id)
      .then((response) => {
        if (response.data.status.code === 200) {
          refreshLogos();
          setErrorMessage("");
        } else {
          setErrorMessage(response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went error-", error);
      });
  };

  const handleSaveOrUpdate = () => {
    const reqLogo = { name };
    CollaborationService.addOrUpdate(reqLogo, file, selectedLogo?.id || 0)
      .then((response) => {
        if (response.data.status.code === 200) {
          refreshLogos();
          setErrorMessage("");
          closeModal();
        } else {
          setErrorMessage(response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went error-", error);
      });
  };

  const openModalForAdd = () => {
    setSelectedLogo(null);
    setFile(null);
    setName("");
    setIsModalOpen(true);
  };

  const openModalForChange = (logo) => {
    setSelectedLogo(logo);
    setFile(null);
    setName(logo.name || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLogo(null);
    setFile(null);
    setName("");
  };

  return (
    <div className={style.container}>
      {logos &&
        logos.map((logo) => (
          <div key={logo.id} className={style.logoBox}>
            <Image
              src={
                logo.imageUrl
                  ? `${BASE_IMAGE_URL + logo.imageUrl}`
                  : "/images/admin/question.png" // fallback
              }
              alt={logo.name}
              className={style.logoImage}
              width={150}
              height={150}
            />
            {console.log(logo.imageUrl)}
            <div className={style.actions}>
              <button onClick={() => handleDelete(logo.id)}>-</button>
              <button onClick={() => openModalForChange(logo)}>Change</button>
            </div>
          </div>
        ))}

      <div
        className={`${style.logoBox} ${style.addBox}`}
        onClick={openModalForAdd}
      >
        <span className={style.plus}>+</span>
      </div>

      {isModalOpen && (
        <div className={style.modalBackdrop} onClick={closeModal}>
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{selectedLogo ? "Change Logo" : "Add Logo"}</h3>
            <input
              type="text"
              placeholder="Logo Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <div className={style.modalActions}>
              <button onClick={closeModal}>Cancel</button>
              <button onClick={handleSaveOrUpdate}>Save</button>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborationEditSection;
