"use client";

import { useState, useEffect } from "react";
import styles from "../../../../../../../public/assets/css/module/admin/formproject.module.css";
import ProjectService from "@/app/services/ProjectService";

export default function ProjectForm({ path = "new" }) {
  const [form, setForm] = useState({
    projectName: "",
    worksDescription: "",
    worksDescriptionEn: "",
    worksDescriptionRu: "",
    workDate: "",
    referenceName: "",
    referenceNameEn: "",
    referenceNameRu: "",
    feedBack: "",
    feedBackEn: "",
    feedBackRu: "",
    path: "",
  });

  const [imageFile, setImageFile] = useState(null);

  // Eğer path yeni değilse projeyi yükle
  useEffect(() => {
    if (path !== "new") {
      ProjectService.getProject(path)
        .then((response) => {
          if (response.data.status.code === 200) {
            setForm(response.data.response);
          } else {
            console.error("Project load failed:", response);
          }
        })
        .catch((err) => console.error("Project load error:", err));
    }
  }, [path]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ProjectService.addOrUpdateProject(form, imageFile, path);
      alert("Project saved successfully!");
    } catch (err) {
      console.error("Project save error:", err);
      alert("Failed to save project. Check console for details.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        {/* Project Name */}
        <div className={styles.field}>
          <label className={styles.label}>Project Name</label>
          <input
            className={styles.input}
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
          />
        </div>

        {/* Path */}
        <div className={styles.field}>
          <label className={styles.label}>Project Slug (path)</label>
          <input
            className={styles.input}
            name="path"
            value={form.path}
            onChange={handleChange}
          />
        </div>

        {/* Description AZ */}
        <div className={styles.fieldFull}>
          <label className={styles.label}>Description (AZ)</label>
          <textarea
            className={styles.textarea}
            name="worksDescription"
            value={form.worksDescription}
            onChange={handleChange}
          />
        </div>

        {/* Description EN */}
        <div className={styles.fieldFull}>
          <label className={styles.label}>Description (EN)</label>
          <textarea
            className={styles.textarea}
            name="worksDescriptionEn"
            value={form.worksDescriptionEn}
            onChange={handleChange}
          />
        </div>

        {/* Description RU */}
        <div className={styles.fieldFull}>
          <label className={styles.label}>Description (RU)</label>
          <textarea
            className={styles.textarea}
            name="worksDescriptionRu"
            value={form.worksDescriptionRu}
            onChange={handleChange}
          />
        </div>

        {/* Work Date */}
        <div className={styles.field}>
          <label className={styles.label}>Work Date</label>
          <input
            className={styles.input}
            type="date"
            name="workDate"
            value={form.workDate}
            onChange={handleChange}
          />
        </div>

        {/* Project Image */}
        <div className={styles.field}>
          <label className={styles.label}>Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </div>

        {/* Reference Names */}
        <div className={styles.field}>
          <label className={styles.label}>Reference (AZ)</label>
          <input
            className={styles.input}
            name="referenceName"
            value={form.referenceName}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Reference (EN)</label>
          <input
            className={styles.input}
            name="referenceNameEn"
            value={form.referenceNameEn}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Reference (RU)</label>
          <input
            className={styles.input}
            name="referenceNameRu"
            value={form.referenceNameRu}
            onChange={handleChange}
          />
        </div>

        {/* Feedbacks */}
        <div className={styles.fieldFull}>
          <label className={styles.label}>Feedback (AZ)</label>
          <textarea
            className={styles.textarea}
            name="feedBack"
            value={form.feedBack}
            onChange={handleChange}
          />
        </div>
        <div className={styles.fieldFull}>
          <label className={styles.label}>Feedback (EN)</label>
          <textarea
            className={styles.textarea}
            name="feedBackEn"
            value={form.feedBackEn}
            onChange={handleChange}
          />
        </div>
        <div className={styles.fieldFull}>
          <label className={styles.label}>Feedback (RU)</label>
          <textarea
            className={styles.textarea}
            name="feedBackRu"
            value={form.feedBackRu}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit">Save Project</button>
      </div>
    </form>
  );
}
