"use client";
import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/aboutuscontent.module.css";
import { useEffect, useState } from "react";
import AboutService from "@/app/services/AboutService";

const defaultInfo = {
  title: "ABOUT US",
  secondTitle: "That’s We’re On Build Of Construction.",
  description:
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form injected humour. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form injected humour.",
  imageUrl: "/images/aboutus.png",
  approximatelyProjectsCount: 60,
};

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

function AboutUsContent() {
  const [content, setContent] = useState(defaultInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AboutService.getAboutInfo("first")
      .then((response) => {
        if (response.data.status.code === 200) {
          setContent(response.data.response);
        } else {
          console.log("something went wrong-", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went wrong-", error);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 100); // smooth geçiş
      });
  }, []); // <-- boş array ekledik

  return (
    <section
      className={`${style.aboutSection} ${loading ? style.skeleton : ""}`}
    >
      {loading ? (
        <>
          <div className={style.aboutText}>
            <div className={`${style.skeletonText} ${style.short}`}></div>
            <div className={`${style.skeletonText} ${style.medium}`}></div>
            <div className={`${style.skeletonText} ${style.long}`}></div>
          </div>

          <div className={style.imageWrapper}>
            <div className={style.skeletonImage}></div>
            <div className={style.skeletonProject}></div>
          </div>
        </>
      ) : (
        <>
          <div className={style.imageWrapper}>
            <Image
              src={
                content.imageUrl && content.imageUrl !== defaultInfo.imageUrl
                  ? `${BASE_IMAGE_URL + content.imageUrl}`
                  : content.imageUrl || "/images/aboutus.png"
              }
              alt="Construction Workers"
              width={500}
              height={500}
              className={style.aboutImage}
            />
            <div className={style.projectCount}>
              <h2>{content.approximatelyProjectsCount}+</h2>
              <p>Project Complete</p>
            </div>
          </div>
          <div className={style.aboutText}>
            <h4>{content.title}</h4>
            <h2>{content.secondTitle}</h2>
            <p>{content.description}</p>
          </div>
        </>
      )}
    </section>
  );
}

export default AboutUsContent;
