"use client";
import Image from "next/image";
import styles from "../../../../public/assets/css/module/modern/projects.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ProjectService from "@/app/services/ProjectService";
import Link from "next/link";

const blogs = [
  {
    date: "25 March 2017",
    title: "Crescent Bay",
    text: "Crescent Bay layihəsində topoqrafiya ölçmələri və ərazi planlaması təmin edildi.",
    img: "/images/projects/crescent.jpg",
    link: "#",
  },
  {
    date: "17 April 2012",
    title: "Hilton Hotel",
    text: "Hilton Hotel layihəsi üçün dəqiq geodeziya və yer səthi ölçmələri həyata keçirildi.",
    img: "/images/projects/hilton.jpg",
    link: "#",
  },
  {
    date: "10 July 2023",
    title: "Victory Park",
    text: "Victory Park layihəsində yüksək dəqiqlikli nöqtə buludu və modellemə işləri aparıldı.",
    img: "/images/projects/zefer.jpg",
    link: "#",
  },
];

export default function Projects() {
  const t = useTranslations("ProjectsHome");
  const [randomProjects, setRandomProjects] = useState([]);

  useEffect(() => {
    ProjectService.getProjects()
      .then((response) => {
        if (response.data.status.code === 200) {
          const projects = response.data.response || [];

          // projeleri karıştır
          const shuffled = [...projects].sort(() => 0.5 - Math.random());

          // ilk 3 tanesini al
          setRandomProjects(shuffled.slice(0, 3));
        }
      })
      .catch((error) => {
        console.log("Something went wrong - ", error);
      });
  }, []);

  return (
    <section className={styles.blogArea}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h1>{t("title")}</h1>
          <span>
            <Image
              src="/images/icons/projects-icon.png"
              alt="icon"
              width={50}
              height={50}
            />
          </span>
          <p>{t("description")}</p>
        </div>

        <div className={styles.blogGrid}>
          {randomProjects &&
            randomProjects.map((project) => (
              <div key={project.id} className={styles.blogCard}>
                <div className={styles.blogImage}>
                  <Image
                    src={project.imageUrl}
                    alt={project.projectName}
                    fill
                    className={styles.image}
                  />
                </div>

                <div className={styles.blogText}>
                  <span>{project.workDate.split("-")[0]}</span>
                  <h4>{project.projectName}</h4>
                  <Link
                    href={`/${t("locale")}/projects/${project.path}`}
                    className={styles.link}
                  >
                    <button className={styles.button}>{t("more")}</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
