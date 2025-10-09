"use client";
import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/second.module.css";
import { useEffect, useState } from "react";
import AboutService from "@/app/services/AboutService";

const defaultInfo = {
  title: "WHY CHOOSE US",
  secondTitle: "What We Offer Idea For Construction.",
  description:
    " There are many variations of passages of Lorem Ipsum available, butthe majority have suffered alteration in some form injected humour.",
  imageUrl: "/images/aboutus.png",
  approximatelyStaffsCount: 20,
};

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

function SecondAboutUsContent() {
  const [content, setContent] = useState(defaultInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AboutService.getAboutInfo("second")
      .then((response) => {
        if (response.data.status.code === 200) {
          setContent(response.data.response);
        } else {
          console.warn("Fallback: default info used");
        }
      })
      .catch((err) => {
        console.error("Error fetching about info:", err);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 100); // smooth geçiş
      });
  }, []);

  return (
    <section className={style.whySection}>
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
          <div className={style.aboutText}>
            <h4>{content.title}</h4>
            <h2>{content.secondTitle}</h2>
            <p>{content.description}</p>
          </div>

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
              <h2>{content.approximatelyStaffsCount}+</h2>
              <p>Total Staff</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default SecondAboutUsContent;
