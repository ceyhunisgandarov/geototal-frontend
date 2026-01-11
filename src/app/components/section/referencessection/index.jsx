'use client'

import ReferenceService from "@/app/services/ReferenceService";
import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/aboutuspage/reference.module.css"


function ReferencesSection() {
  const [references, setReferences] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(()=> {
    ReferenceService.getReferenceList().then((response)=> {
        if(response.data.status.code===200) {
            setReferences(response.data.response);
        } else {
            setErrorMessage(response.data.status.message);
        }
    }).catch((error)=> {
        console.log("Something went wrong", error)
    })
  }, [])


  return (
    <>
      <div className={style.galleryContainer}>
        {references.map((reference) => (
          <div key={reference.id} className={style.imageItem}>
            <Image
              src={reference.pathName}
              alt="reference"
              fill
              className={style.image}
              onClick={() => setSelectedImage(reference.pathName)}
            />
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedImage && (
        <div className={style.modalOverlay} onClick={() => setSelectedImage(null)}>
          <div className={style.modalContent}>
            <Image
              src={selectedImage}
              alt="big"
              width={1200}
              height={800}
              className={style.modalImage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ReferencesSection;
