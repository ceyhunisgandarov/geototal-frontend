"use client";

import CertificateService from "@/app/services/CertificateService";
import { useEffect, useState } from "react";
import styles from "../../../../../../public/assets/css/module/certificate/style.module.css";
import Image from "next/image";

function CertificateAdmin() {
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [certificates, setCertificates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [image, setImage] = useState(null);
  const [id, setId] = useState(null);

  const [certificateData, setCertificateData] = useState({ title: "", description: "", titleEn: "", titleRu: "", titleKy: "", descriptionEn: "", descriptionRu: "", descriptionKy: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    refreshCertificates();
  }, []);

  const refreshCertificates = () => {
    CertificateService.getCertificateList()
      .then((res) => {
        if (res.data.status.code === 200) {
          setCertificates(res.data.response || []);
        }
      })
      .catch(() => {
        setAlert({ type: "error", message: "Server error" });
      });
  };

  const resetForm = () => {
    setCertificateData({ title: "", description: "", titleEn: "", titleRu: "", titleKy: "", descriptionEn: "", descriptionRu: "", descriptionKy: "" });
    setImage(null);
    setId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true); setSaveError("");
    try {
      const res = await CertificateService.addOrUpdateCertificate(certificateData, image, id);
      if (res.data?.status?.code !== 200) {
        setSaveError(res.data?.status?.message || "Sertifikat saxlanmadı."); return;
      }
      refreshCertificates(); resetForm();
    } catch (error) {
      setSaveError(error?.response?.data?.status?.message || "Serverlə əlaqə alınmadı. Yenidən cəhd edin.");
    } finally { setSaving(false); }
  };

  const handleEdit = (cert) => {
    setImage(null); setSaveError("");
    setCertificateData({
      titleEn: cert.titleEn ?? "",
      titleRu: cert.titleRu ?? "",
      titleKy: cert.titleKy ?? "",
      descriptionEn: cert.descriptionEn ?? "",
      descriptionRu: cert.descriptionRu ?? "",
      descriptionKy: cert.descriptionKy ?? "",
      title: cert.title,
      description: cert.description,
    });
    setId(cert.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (deletingId !== null || !confirm("Bu qeydi silmək istəyirsiniz?")) return;
    setDeletingId(id);
    setDeleteError("");
    try {
      const { data } = await CertificateService.deleteCertificate(id);
      if (data?.status?.code !== 200) {
        setDeleteError(data?.status?.message || "Qeyd silinmədi.");
        return;
      }
      setCertificates(items => items.filter(item => item.id !== id));
    } catch (error) {
      setDeleteError(error?.response?.data?.status?.message || "Serverlə əlaqə alınmadı. Yenidən cəhd edin.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Certificates</h2>

      {alert.message && (
        <div className={`${styles.alert} ${styles[alert.type]}`}>
          {alert.message}
        </div>
      )}

      <button className={styles.addBtn} onClick={() => { resetForm(); setSaveError(""); setShowForm(true); }}>
        + Add Certificate
      </button>

      {/* GRID */}
      {deleteError && <p role="alert" style={{color: "#b91c1c"}}>{deleteError}</p>}
      {certificates.length === 0 && <p>Hələ qeyd yoxdur.</p>}
      <div className={styles.grid}>
        {certificates.map((cert) => (
          <div key={cert.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={cert.imageUrl}
                alt={cert.title}
                width={300}
                height={300}
                className={styles.image}
              />
            </div>
            <h3>{cert.title}</h3>
            <p>{cert.description}</p>

            <div className={styles.actions}>
              <button onClick={() => handleEdit(cert)}>Update</button>
              <button
                disabled={deletingId !== null}
                onClick={() => handleDelete(cert.id)}
                className={styles.delete}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      {showForm && (
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Title (AZ)"
            value={certificateData.title}
            onChange={(e) =>
              setCertificateData({ ...certificateData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description (AZ)"
            value={certificateData.description}
            onChange={(e) =>
              setCertificateData({
                ...certificateData,
                description: e.target.value,
              })
            }
          />

          {["En", "Ru", "Ky"].map(language => (
            <div key={language}>
              <label>Title ({language.toUpperCase()})</label>
              <input name={`title${language}`} maxLength={255} value={certificateData[`title${language}`]}
                onChange={e => setCertificateData(prev => ({...prev, [`title${language}`]: e.target.value}))} />
              <label>Description ({language.toUpperCase()})</label>
              <textarea name={`description${language}`} maxLength={255} value={certificateData[`description${language}`]}
                onChange={e => setCertificateData(prev => ({...prev, [`description${language}`]: e.target.value}))} />
            </div>
          ))}
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          {saveError && <p role="alert" style={{color: "#b91c1c"}}>{saveError}</p>}
          <div className={styles.formActions}>
            <button disabled={saving} onClick={handleSubmit}>Save</button>
            <button disabled={saving} onClick={resetForm} className={styles.cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateAdmin;
