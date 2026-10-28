"use client";
import {useEffect, useState, useRef} from "react";
import {useLocale} from "next-intl";
import {insertBlogImage,blogSaveError} from "@/lib/blog-editor";
import BlogBody from "@/app/components/blog/body";
import BlogService from "@/app/services/BlogService";
import {localizedText} from "@/lib/localizedText";
import styles from "../../../../../../public/assets/css/module/admin/formproject.module.css";

const languages = [["", "AZ"], ["En", "EN"], ["Ru", "RU"], ["Ky", "KY"]];
const emptyForm = () => Object.fromEntries(languages.flatMap(([suffix]) =>
  [[`title${suffix}`, ""], [`description${suffix}`, ""], [`seoTitle${suffix || "Az"}`, ""], [`seoDescription${suffix || "Az"}`, ""]]));

export default function BlogAdmin() {
  const locale = useLocale();
  const editors=useRef({});
  const [uploading,setUploading]=useState(false);
  const [captions,setCaptions]=useState({});
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(null);
  const [id, setId] = useState(0);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reviewNotes,setReviewNotes]=useState([]);
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
    setForm({...next,slug:blog?.slug ?? "",published:blog?.published === true}); setId(blog?.id ?? 0); setImage(null); setError("");setReviewNotes([]);
  };
  const save = async (event) => {
    event.preventDefault(); if(saving || uploading)return; setSaving(true); setError("");
    try {
      const {data} = await BlogService.saveBlog(form, image, id);
      if (data.status.code !== 200) {setError(data?.status?.message || "Blog could not be saved."); return;}
      setForm(null); await refresh();
    } catch (error) {setError(blogSaveError(error));}
    finally {setSaving(false);}
  };
  const insertImage=async (event,suffix)=>{
    const input=event.target,file=input.files?.[0];if(!file)return;
    const caption=captions[suffix]?.trim();
    if(!caption){setError("Əvvəl şəkil üçün izah yazın.");input.value='';return;}
    if(!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>10*1024*1024){setError("10 MB-a qədər JPG, PNG və ya WebP şəkli seçin.");input.value='';return;}
    const field='description'+suffix, editor=editors.current?.[suffix];
    const start=editor?.selectionStart ?? form[field].length,end=editor?.selectionEnd ?? start;
    setUploading(true);setError('');
    try {
      const {data}=await BlogService.uploadInlineImage(file);
      if(data?.status?.code!==200)throw new Error(data?.status?.message || 'Şəkil yüklənmədi.');
      const next=insertBlogImage(form[field],start,end,data.response,caption);
      setForm(previous=>({...previous,[field]:next}));setCaptions(previous=>({...previous,[suffix]:''}));
    }catch(error){setError(error.response ? blogSaveError(error) : error.message || 'Şəkil yüklənmədi.');}
    finally{setUploading(false);input.value='';}
  };
  return <section className={styles.form}>
    <h2>Blog</h2>
    {error && <p role="alert" style={{color:"#b91c1c"}}>{error}</p>}
    <button type="button" disabled={saving || uploading} onClick={() => open(null)}>Add Blog</button>
    {blogs.map(blog => <article key={blog.id}>
      <h3>{localizedText(blog, "title", locale)}</h3>
      <p>{blog.published ? "Yayımlanıb" : "Qaralama"}</p>
      <button type="button" disabled={saving || uploading} onClick={() => open(blog)}>Edit Blog</button>
    </article>)}
    {form && <form onSubmit={save}>
      <fieldset disabled={saving || uploading} style={{border:0,padding:0,minWidth:0}}>
      <label>Hazırlanmış məqaləni aç <input type="file" accept="application/json,.json" onChange={async e=>{
       try {const data=JSON.parse(await e.target.files[0].text());if(data.type!=='blog' || !data.request || (id!==0 && form.slug!==data.request.slug))throw Error();
        const next=emptyForm();for(const key of Object.keys(next))next[key]=typeof data.request[key]==='string'?data.request[key]:'';
        setForm({...next,slug:data.request.slug || '',published:false});setReviewNotes(data.reviewNotes || []);setError('');
       }catch{setError('Düzgün bloq hazırlıq faylı seçin.');}
      }}/></label>
      <label>Səhifə ünvanı <input value={form.slug || ''} disabled={id!==0} onChange={e=>setForm({...form,slug:e.target.value})}/></label>
      <label><input type="checkbox" checked={form.published===true} onChange={e=>setForm({...form,published:e.target.checked})}/> Yayımla (bütün dil versiyalarını yoxladıqdan sonra)</label>

      {reviewNotes.length>0 && <p style={{background:"#fff3cd",padding:12}}>{reviewNotes.join(" ")}</p>}
      <p>Hazır JSON faylını açdıqda şəkillərin yeri saxlanır. Word-dən adi yapışdırma şəkilləri daşımır; yeni şəkil üçün aşağıdakı seçicidən istifadə edin.</p>
      <p>Mətn Markdown formatındadır: ## bölmə başlığı, [keçid](ünvan), ![şəkil izahı](şəkil ünvanı).</p>
      <div className={styles.grid}>
        {languages.map(([suffix, label]) => <fieldset key={label} className={styles.fieldFull}>
          <legend>{label}</legend>
          <label className={styles.label} htmlFor={`blog-title-${label}`}>Title ({label})</label>
          <input id={`blog-title-${label}`} className={styles.input} name={`title${suffix}`}
            value={form[`title${suffix}`]} required={form.published || label !== "KY"}
            onChange={e => setForm({...form, [e.target.name]: e.target.value})}/>
          <label className={styles.label} htmlFor={`blog-description-${label}`}>Description ({label})</label>
          <textarea ref={element=>{editors.current[suffix]=element;}} rows={14} id={`blog-description-${label}`} className={styles.textarea} name={`description${suffix}`}
            value={form[`description${suffix}`]} required={form.published || label !== "KY"}
            onChange={e => setForm({...form, [e.target.name]: e.target.value})}/>
          <label>Şəklin izahı ({label})<input name={`imageCaption${suffix}`} value={captions[suffix] || ''} onChange={e=>setCaptions({...captions,[suffix]:e.target.value})}/></label>
          <label>Mətn arasına şəkil əlavə et ({label})<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>insertImage(e,suffix)}/></label>
          <p>Şəkil mətn sahəsində kursorun olduğu yerə əlavə olunur.</p>
          <details><summary>Önbaxış ({label})</summary><BlogBody text={form[`description${suffix}`]}/></details>
          <label>SEO başlığı ({label})<input value={form[`seoTitle${suffix || 'Az'}`] || ''} onChange={e=>setForm({...form,[`seoTitle${suffix || 'Az'}`]:e.target.value})}/></label>
          <label>SEO təsviri ({label})<textarea value={form[`seoDescription${suffix || 'Az'}`] || ''} onChange={e=>setForm({...form,[`seoDescription${suffix || 'Az'}`]:e.target.value})}/></label>
        </fieldset>)}
      </div>
      <label>Üz qabığı şəkli (istəyə bağlı) <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setImage(e.target.files[0] ?? null)}/></label>
      </fieldset>
      {uploading && <p role="status">Şəkil yüklənir…</p>}
      {error && <p role="alert" style={{color:"#b91c1c"}}>{error}</p>}
      <div className={styles.actions}>
        <button type="submit" disabled={saving || uploading}>Save Blog</button>
        <button type="button" disabled={saving || uploading} onClick={() => setForm(null)}>Cancel</button>
      </div>
    </form>}
  </section>;
}
