"use client";
import { localizedText, localizedProjectName } from "@/lib/localizedText";
import ProjectService from "@/app/services/ProjectService";
import { useEffect, useState } from "react";
import styles from "../../../../../public/assets/css/module/projects/aproject.module.css";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import ReferenceLetter from "../reference";
import { useRouter } from "next/navigation";

function ProjectSection({ project }) {
  const t = useTranslations("Projects");
  const [projectContent, setProjectContent] = useState({});
  const router = useRouter();
  const locale = useLocale();
  const contentFromDb = localizedText(projectContent, "worksDescription", locale);
  const feedback = localizedText(projectContent, "feedBack", locale);
  const isLoading = !projectContent || !projectContent.projectName;

  useEffect(() => {
    ProjectService.getProject(project)
      .then((response) => {
        if (response.data.status.code === 200) {
          console.log(response.data.response);
          setProjectContent(response.data.response);
        } else if (response.data.status.code === 404) {
          router.replace("/404");
        } else {
          console.log("Something went wrong: ", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("Internal error: ", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle} />

          <div className={styles.skeletonContentWrapper}>
            <div className={styles.skeletonText}>
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
              <br />
              <br />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
            </div>

            <div className={styles.skeletonImage} />
          </div>
        </div>
      ) : (
        <>
          <h1 className={styles.title}>
            {localizedProjectName(projectContent, locale)}{" "}
            {projectContent.customer && ` - ${projectContent.customer}`}
          </h1>

          <div className={styles.contentWrapper}>
            <div
              className={styles.textContent}
              dangerouslySetInnerHTML={{ __html: contentFromDb }}
            />
            <div className={styles.imageWrapper}>
              <Image
                src={projectContent.imageUrl}
                alt={projectContent.path}
                width={300}
                height={300}
                className={styles.image}
              />
            </div>
          </div>

          {feedback && feedback !== "null" && (
            <>
              <hr />
              <div className={styles.feedback}>
                <span></span>
                <p>{feedback}</p>
              </div>
            </>
          )}
        </>
      )}
      {projectContent.referenceLetter && (
        <ReferenceLetter src={projectContent.referenceLetter} />
      )}
    </div>
  );
}

export default ProjectSection;
