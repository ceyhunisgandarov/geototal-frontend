"use client";

import { useState } from "react";
import styles from "../../../../../public/assets/css/module/contact/contactform.module.css";

import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit işlemi buraya gelecek (boş bırakıldı)
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Left Side (info boxes) */}
        <div className={styles.infoSection}>
          <div className={styles.infoBox}>
            <div className={styles.iconWrapper}>
              <MapPin className={styles.icon} />
            </div>
            <div>
              <h4>Location:</h4>
              <p>
                121 King Street, Melbourne <br />
                Victoria 3000 Australia
              </p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.iconWrapper}>
              <Phone className={styles.icon} />
            </div>
            <div>
              <h4>Phone:</h4>
              <p>
                (+61 3 8376 6284) <br /> (+800 2345 6789)
              </p>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.iconWrapper}>
              <Mail className={styles.icon} />
            </div>
            <div>
              <h4>Email us at:</h4>
              <p>
                info@medunit.com <br /> medunit@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Right Side (form) */}
        <div className={styles.formSection}>
          <h5 className={styles.smallTitle}>Get in Touch</h5>
          <h2 className={styles.formTitle}>Send us a Message</h2>
          <p className={styles.subtitle}>
            Molestiae non recusandae itaque earum rerum sarien.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
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
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <textarea
              name="message"
              placeholder="Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className={styles.textarea}
            ></textarea>

            <button type="submit" className={styles.submitBtn}>
              Send Now
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <iframe
          title="Geototal MMC"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.8668100718696!2d49.85841687623314!3d40.41180127144044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d9037dce47f%3A0x114f450925aafefa!2sGeoTotal%20MMC!5e0!3m2!1saz!2saz!4v1756750063193!5m2!1saz!2saz"
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
