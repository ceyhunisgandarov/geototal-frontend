"use client";

import { useEffect, useState } from "react";
import styles from "../../../../../public/assets/css/module/contact/contactform.module.css";
import { MapPin, Phone, Mail } from "lucide-react";
import ContactService from "@/app/services/ContactService";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [contactInfo, setContactInfo] = useState({
    address: "",
    phoneNumbers: [],
    emailAddress: [],
    googleEmbeddedLink: "",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContactService.getContact()
      .then((response) => {
        if (response.data.status.code === 200) {
          setContactInfo(response.data.response);
        } else {
          console.log("something went wrong -", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("something went wrong -", error);
      })
      .finally(() => setLoading(false)); // ✅ skeleton kapanır
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: backend'e gönderilecek
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Left Side (info boxes) */}
        <div className={styles.infoSection}>
          {loading ? (
            <>
              <div className={styles.skeletonBox}></div>
              <div className={styles.skeletonBox}></div>
              <div className={styles.skeletonBox}></div>
            </>
          ) : (
            <>
              <div className={styles.infoBox}>
                <div className={styles.iconWrapper}>
                  <MapPin className={styles.icon} />
                </div>
                <div>
                  <h4>{t("location")}:</h4>
                  <p>{contactInfo.address || "Not provided"}</p>
                </div>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.iconWrapper}>
                  <Phone className={styles.icon} />
                </div>
                <div>
                  <h4>{t("phones")}:</h4>
                  {contactInfo.phoneNumbers?.length ? (
                    contactInfo.phoneNumbers.map((number, idx) => (
                      <p key={idx}>{number}</p>
                    ))
                  ) : (
                    <p>Not provided</p>
                  )}
                </div>
              </div>

              <div className={styles.infoBox}>
                <div className={styles.iconWrapper}>
                  <Mail className={styles.icon} />
                </div>
                <div>
                  <h4>{t("emails")}:</h4>
                  {contactInfo.emailAddress?.length ? (
                    contactInfo.emailAddress.map((email, idx) => (
                      <p key={idx}>{email}</p>
                    ))
                  ) : (
                    <p>Not provided</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side (form) */}
        <div className={styles.formSection}>
          <h5 className={styles.smallTitle}>{t("title")}</h5>
          <h2 className={styles.formTitle}>{t("sendMessage")}</h2>
          <p className={styles.subtitle}>{t("header")}</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <input
                type="text"
                name="firstName"
                placeholder={t("firstName")}
                value={formData.firstName}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="lastName"
                placeholder={t("lastName")}
                value={formData.lastName}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <input
                type="email"
                name="email"
                placeholder={t("email")}
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="phone"
                placeholder={t("phone")}
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <textarea
              name="message"
              placeholder={t("message")}
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className={styles.textarea}
            ></textarea>

            <button type="submit" className={styles.submitBtn}>
              {t("send")}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.mapSection}>
        <iframe
          title="Geototal MMC"
          src={
            // contactInfo.googleEmbeddedLink ||
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.8668100718696!2d49.85841687623314!3d40.41180127144044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d9037dce47f%3A0x114f450925aafefa!2sGeoTotal%20MMC!5e0!3m2!1saz!2saz!4v1756750063193!5m2!1saz!2saz"
          }
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
