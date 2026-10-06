"use client";
import {useEffect, useState} from "react";
import {useLocale} from "next-intl";
import BlogService from "@/app/services/BlogService";
import {localizedText} from "@/lib/localizedText";
import styles from "../../../../../../public/assets/css/module/admin/formproject.module.css";

const languages = [["", "AZ"], ["En", "EN"], ["Ru", "RU"], ["Ky", "KY"]];
const emptyForm = () => Object.fromEntries(languages.flatMap(([suffix]) =>
  [[`title${suffix}`, ""], [`description${suffix}`, ""]]));

export default function BlogAdmin() {
  const locale = useLocale();
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(null);
  const [id, setId] = useState(0);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const refresh = async () => {
    try {
      const {data} = await BlogService.getBlogs();
      if (data.status.code === 200) setBlogs(data.response);
      else if (data.status.code === 404) setBlogs([]);
      else setError("Blog list could not be loaded.");
    } catch {setError("Blog list could not be loaded.");}
  };
  useEffect(() => {refresh();}, []);
  const open = (blog) => {
    const next = emptyForm();
    if (blog) for (const key of Object.keys(next)) next[key] = blog[key] ?? "";
    setForm(next); setId(blog?.id ?? 0); setImage(null); setError("");
  };
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const {data} = await BlogService.saveBlog(form, image, id);
      if (data.status.code !== 200) {setError("Blog could not be saved."); return;}
      setForm(null); await refresh();
    } catch {setError("Blog could not be saved.");}
    finally {setSaving(false);}
  };
  return <section className={styles.form}>
    <h2>Blog</h2>
    {error && <p role="alert">{error}</p>}
    <button type="button" onClick={() => open(null)}>Add Blog</button>
    {blogs.map(blog => <article key={blog.id}>
      <h3>{localizedText(blog, "title", locale)}</h3>
      <p>{localizedText(blog, "description", locale)}</p>
      <button type="button" onClick={() => open(blog)}>Edit Blog</button>
    </article>)}
    {form && <form onSubmit={save}>
      <div className={styles.grid}>
        {languages.map(([suffix, label]) => <fieldset key={label} className={styles.fieldFull}>
          <legend>{label}</legend>
          <label className={styles.label} htmlFor={`blog-title-${label}`}>Title ({label})</label>
          <input id={`blog-title-${label}`} className={styles.input} name={`title${suffix}`}
            value={form[`title${suffix}`]} required={label !== "KY"}
            onChange={e => setForm({...form, [e.target.name]: e.target.value})}/>
          <label className={styles.label} htmlFor={`blog-description-${label}`}>Description ({label})</label>
          <textarea id={`blog-description-${label}`} className={styles.textarea} name={`description${suffix}`}
            value={form[`description${suffix}`]} required={label !== "KY"}
            onChange={e => setForm({...form, [e.target.name]: e.target.value})}/>
        </fieldset>)}
      </div>
      <label>Image <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0] ?? null)}/></label>
      <div className={styles.actions}>
        <button type="submit" disabled={saving}>Save Blog</button>
        <button type="button" disabled={saving} onClick={() => setForm(null)}>Cancel</button>
      </div>
    </form>}
  </section>;
}
