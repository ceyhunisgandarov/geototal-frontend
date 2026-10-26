"use client";

import { useState, useEffect } from "react";
import styles from "../../../../../../../public/assets/css/module/admin/formproject.module.css";
import ProjectService from "@/app/services/ProjectService";

export default function ProjectForm({ path = "new", onSaved }) {
  const [form, setForm] = useState({
    id: 0,
    customer: "",
    projectNameKy: "",
    projectNameEn: "",
    projectNameRu: "",
    referenceNameKy: "",
    feedBackKy: "",
    projectName: "",
    worksDescription: "",
    worksDescriptionEn: "",
    worksDescriptionRu: "",
    worksDescriptionKy: "",
    workDate: "",
    referenceName: "",
    referenceNameEn: "",
    referenceNameRu: "",
    feedBack: "",
    feedBackEn: "",
    feedBackRu: "",
    path: "",
  });

  const [loading, setLoading] = useState(path !== "new");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [referenceLetter, setReferenceLetter] = useState(null);

  useEffect(() => {
    if (path === "new") return;
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    ProjectService.getProject(path)
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.status?.code !== 200 || !data.response?.id) throw new Error("Layihə yüklənmədi.");
        setForm(data.response);
      })
      .catch(() => {
        if (!cancelled) { setLoadFailed(true); setError("Layihə yüklənmədi. Formu yenidən açın."); }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [path]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || saving || loadFailed) return;
    setSaving(true);
    setError("");
    try {
      const result = await ProjectService.addOrUpdateProject(
        form,
        imageFile,
        form.id ?? 0,
        referenceLetter
      );
      if (result.data.status.code !== 200 || !result.data.response?.id) {
        throw new Error(result.data.status.message || "Layihə saxlanmadı.");
      }
      setForm(result.data.response);
      setImageFile(null);
      setReferenceLetter(null);
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Project save error:", err);
      setError(err.message || "Layihə saxlanmadı.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      <fieldset disabled={loading || saving || loadFailed} style={{border: 0, padding: 0}}>
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

        <div className={styles.fieldFull}>
          <label className={styles.label}>Project Name (KY)</label>
          <input className={styles.input} name="projectNameKy"
            value={form.projectNameKy ?? ""} onChange={handleChange} />
        </div>


        {['En', 'Ru'].map(language => (
          <div className={styles.fieldFull} key={language}>
            <label className={styles.label}>Project Name ({language.toUpperCase()})</label>
            <input className={styles.input} name={`projectName${language}`}
              value={form[`projectName${language}`] ?? ""} onChange={handleChange} />
          </div>
        ))}
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

        {/* Customer */}
        <div className={styles.field}>
          <label className={styles.label}>Customer</label>
          <input
            className={styles.input}
            name="customer"
            value={form.customer}
            onChange={handleChange}
          />
        </div>

<div style={{gridColumn: "1 / -1", width: "100%"}}>
 <h3>SEO təsviri</h3>
 <p>Axtarış nəticələri üçün qısa, tamamlanmış cümlələr yazın. Boş qalsa, səhifənin mətnindən avtomatik hazırlanacaq.</p>
 {['Az', 'En', 'Ru', 'Ky'].map(language => (
  <label key={language} style={{display: "block", marginBottom: 12}}>
   SEO təsviri ({language.toUpperCase()})
   <textarea name={`seoDescription${language}`} rows={3} style={{display: "block", width: "100%"}}
    value={form[`seoDescription${language}`] ?? ""}
    onChange={e => setForm(previous => ({...previous, [`seoDescription${language}`]: e.target.value}))} />
   <small>{(form[`seoDescription${language}`] ?? "").length} simvol · Qısa təsvir tövsiyə olunur; mətn avtomatik kəsilmir.</small>
  </label>
 ))}
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

        <div className={styles.fieldFull}>
          <label className={styles.label}>Description (KY)</label>
          <textarea className={styles.textarea} name="worksDescriptionKy"
            value={form.worksDescriptionKy ?? ""} onChange={handleChange} />
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

        <div className={styles.fieldFull}>
          <label className={styles.label}>Reference (KY)</label>
          <input className={styles.input} name="referenceNameKy"
            value={form.referenceNameKy ?? ""} onChange={handleChange} />
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

        <div className={styles.fieldFull}>
          <label className={styles.label}>Feedback (KY)</label>
          <textarea className={styles.textarea} name="feedBackKy"
            value={form.feedBackKy ?? ""} onChange={handleChange} />
        </div>

        {/****** Reference letter image ******/}
        <div className={styles.field}>
          <label className={styles.label}>Reference Letter</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReferenceLetter(e.target.files[0] || null)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={loading || saving || loadFailed}>{saving ? "Saxlanır…" : "Save Project"}</button>
      </div>
      </fieldset>
    </form>
  );
}
