// components/BookingArea.jsx
import { useEffect, useState } from "react";
import styles from "../../../../public/assets/css/module/modern/contact.module.css";
import Image from "next/image";
import ServicesService from "@/app/services/ServicesService";
import { useTranslations } from "next-intl";
import MainService from "@/app/services/MainService";

export default function ModernContact() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const t = useTranslations("ServiceForm");

  useEffect(() => {
    getServiceList();
  }, []);

  const getServiceList = () => {
    ServicesService.getServices()
      .then((response) => {
        if (response.data.status.code === 200) {
          setServices(response.data.response);
        } else {
          console.log(response.data.status.message, "- something went wrong");
        }
      })
      .catch((error) => {
        console.log(error, "- something went wrong");
      });
  };

  const getServiceName = (service) => {
    const locale = t("locale");
    return locale === "az"
      ? service.serviceName
      : locale === "en"
      ? service.serviceNameEn
      : service.serviceNameRu;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const email = formData.get("email")?.trim();
    const phone = formData.get("phone")?.trim();

    // ✅ VALIDATION
    if (!email && !phone) {
      alert(t("emailOrPhoneRequired"));
      return;
    }

    const jsonData = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email,
      phone,
      service: formData.get("service"),
    };

    MainService.sendMailAboutService(jsonData)
      .then((response) => {
        if (response.data.status.code === 200) {
          alert(t("successMessage"));
          setMessage(t("successMessage"));
          e.target.reset();
        } else {
          alert(t("errorMessage"));
          setMessage(t("errorMessage"));
        }
      })
      .catch(() => {
        alert(t("errorMessage"));
        setMessage(t("errorMessage"));
      });
  };

  return (
    <section className={styles.bookingArea}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <div className={styles.sectionTitle}>
            <h1>{t("contactTitle")}</h1>
            <span className={styles.icon}>
              <Image
                src="/images/icons/mail-icon.png"
                alt="koffee"
                width={50}
                height={40}
              />
            </span>
            <p>{t("contactDesc")}</p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <input type="text" placeholder={t("firstname")} name="firstname" />
            <input type="text" placeholder={t("lastname")} name="lastname" />
            <input type="email" placeholder={t("email")} name="email" />
            <input type="text" placeholder={t("phone")} name="phone" />
          </div>
          <select name="service" defaultValue="">
            <option value="" disabled>
              {t("choose")}
            </option>
            {services &&
              services.map((service) => (
                <option key={service.id} value={service.pathName}>
                  {getServiceName(service)}
                </option>
              ))}
          </select>
          <div className={styles.submitWrap}>
            <button type="submit" className={styles.button}>
              {t("submit")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
