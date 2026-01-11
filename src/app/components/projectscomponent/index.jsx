"use client";
import styles from "../../../../public/assets/css/module/projects/project.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ProjectService from "@/app/services/ProjectService";
import Image from "next/image";
import Link from "next/link";

function ProjectsComponent() {
  const t = useTranslations("Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ProjectService.getProjects();
        if (response.data.status.code === 200) {
          setProjects(response.data.response);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.log("something went wrong-", { error });
      } finally {
        setLoading(false); // loading bitiyor
      }
    };
    fetchProjects();
  }, []);

  const getDescriptionByLocale = (project) => {
    const locale = t("locale"); // örn: "az", "en", "ru"

    let desc = "";

    switch (locale) {
      case "en":
        desc = project.worksDescriptionEn;
        break;
      case "ru":
        desc = project.worksDescriptionRu;
        break;
      default:
        desc = project.worksDescription;
    }

    if (!desc) return "";

    return desc.length > 120 ? desc.substring(0, 120) + "..." : desc;
  };

  return (
    <main className={styles.container}>
      <section className={styles.sectionHeader}>
        <p className={styles.viewAll}>{t("all")}</p>
      </section>

      <div className={styles.projectsGrid}>
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div className={styles.skeletonCard} key={idx}></div>
            ))
          : projects.map((project) => (
              <Link
                href={`/${t("locale")}/projects/${project.path}`}
                key={project.id}
                className={styles.link}
              >
                <article className={styles.projectCard}>
                  <div className={styles.projectImage}>
                    <Image
                      src={project.imageUrl || "/assets/img/placeholder.png"}
                      alt={project.projectName || "Project image"}
                      width={300}
                      height={240}
                      className={styles.image}
                    />
                  </div>
                  <div className={styles.projectInfo}>
                    <h3>{project.projectName}</h3>
                    <p>{getDescriptionByLocale(project)}</p>
                  </div>
                </article>
              </Link>
            ))}
      </div>

      <div className={styles.footerAction}>
        <button className={styles.btnDark}>{t("all")}</button>
      </div>
    </main>
  );
}

export default ProjectsComponent;
