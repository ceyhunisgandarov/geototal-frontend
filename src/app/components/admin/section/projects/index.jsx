"use client";

import { useEffect, useState } from "react";
import ProjectService from "@/app/services/ProjectService";
import styles from "../../../../../../public/assets/css/module/admin/project.module.css";
import ProjectForm from "./form";
import Image from "next/image";

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    projectList();
  }, []);

  const projectList = () => {
    ProjectService.getProjects()
      .then((response) => {
        if (response.data.status.code === 200) {
          setProjects(response.data.response);
        } else {
          setProjects([]);
        }
      })
      .catch((error) => {
        console.log("something went wrong-", { error });
      });
  };

  const handleAddNew = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  const handleUpdate = (project) => {
    setSelectedProject(project);
    setShowForm(true);
  };

  const handleDelete = (project) => {
    if (confirm('Are you sure you want to delete this project?')) {
      ProjectService.deleteProject(project.path).then(() => projectList());
    }
  };

  const handleCloseForm = () => {
    setSelectedProject(null);
    setShowForm(false);
    projectList();
  };

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>Project Management</h1>
        <p>Manage multilingual project content and image</p>
      </div>

      <div className={styles.cardContainer}>
        {projects.map((project) => (
          <div className={styles.projectCard} key={project.id}>
            <div className={styles.projectImage}>
              <Image src={project.imageUrl} alt={project.projectName} width={300} height={300} className={styles.image}/>
            </div>
            <h3>{project.projectName}</h3>
            <div className={styles.projectActions}>
              <button onClick={() => handleUpdate(project)} className={styles.updateBtn}>
                Update
              </button>
              <button onClick={() => handleDelete(project)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addButton} onClick={handleAddNew}>
        Add New Project
      </button>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.modalClose} onClick={handleCloseForm}>
              ×
            </button>
            <ProjectForm path={selectedProject ? selectedProject.path : "new"} />
          </div>
        </div>
      )}
    </section>
  );
}
