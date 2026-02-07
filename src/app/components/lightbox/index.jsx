"use client";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ImageLightbox({ src, style }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt="certificate"
        width={300}
        height={300}
        className={style}
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      />

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src }]}
        controller={{
          swipe: false,
          drag: false,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </>
  );
}
