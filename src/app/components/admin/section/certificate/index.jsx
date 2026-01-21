"use client";

import CertificateService from "@/app/services/CertificateService";
import { useEffect, useState } from "react";
import styles from "../../../../../../public/assets/css/module/certificate/style.module.css";
import Image from "next/image";

function CertificateAdmin() {
  const [certificates, setCertificates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [image, setImage] = useState(null);
  const [id, setId] = useState(null);

  const [certificateData, setCertificateData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    refreshCertificates();
  }, []);

  const refreshCertificates = () => {
    CertificateService.getCertificateList()
      .then((res) => {
        if (res.data.status.code === 200) {
          setCertificates(res.data.response);
        }
      })
      .catch(() => {
        setAlert({ type: "error", message: "Server error" });
      });
  };

  const resetForm = () => {
    setCertificateData({ title: "", description: "" });
    setImage(null);
    setId(null);
    setShowForm(false);
  };

  const handleSubmit = () => {
    CertificateService.addOrUpdateCertificate(certificateData, image, id)
      .then((res) => {
        if (res.data.status.code === 200) {
          setAlert({
            type: "success",
            message: "Certificate saved successfully",
          });
          refreshCertificates();
          resetForm();
        } else {
          setAlert({ type: "error", message: res.data.status.message });
        }
      })
      .catch(() => {
        setAlert({ type: "error", message: "Internal server error" });
      });
  };

  const handleEdit = (cert) => {
    setCertificateData({
      title: cert.title,
      description: cert.description,
    });
    setId(cert.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure?")) return;

    CertificateService.deleteCertificate(id).then(() => {
      refreshCertificates();
    });
  };

  return (
    <div className={styles.container}>
      <h2>Certificates</h2>

      {alert.message && (
        <div className={`${styles.alert} ${styles[alert.type]}`}>
          {alert.message}
        </div>
      )}

      <button className={styles.addBtn} onClick={() => setShowForm(true)}>
        + Add Certificate
      </button>

      {/* GRID */}
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
            placeholder="Title"
            value={certificateData.title}
            onChange={(e) =>
              setCertificateData({ ...certificateData, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={certificateData.description}
            onChange={(e) =>
              setCertificateData({
                ...certificateData,
                description: e.target.value,
              })
            }
          />

          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <div className={styles.formActions}>
            <button onClick={handleSubmit}>Save</button>
            <button onClick={resetForm} className={styles.cancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateAdmin;
