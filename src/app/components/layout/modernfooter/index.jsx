import { useTranslations } from "next-intl";
import styles from "../../../../../public/assets/css/module/layout/modernfooter.module.css";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

export default function ModernFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className={styles.footer}>
      {/* TOP AREA */}
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* About */}
            <div className={styles.widget}>
              <h3>{t("aboutus")}</h3>
              <p>{t("description")}</p>
              <p>{t("descriptionSecond")}</p>
            </div>

            {/* Contact */}
            <div className={styles.widget}>
              <h3>{t("contactus")}</h3>
              <span className={styles.info}>📧 office@geototal.az</span>
              <span className={styles.info}>📞 (+994 55 2053403)</span>
              <span className={styles.info}>📍 {t("address")}</span>             {/* Nərimanov r., Əhməd Rəcəbli küç., 27b */}
            </div>

            {/* Hours */}
            <div className={styles.widget}>
              <h3>{t("openhours")}</h3>
              <p>{t("openhoursdesc")}</p>
              <span className={styles.time}>{t("weekdays")}</span>{/* Mon - Fri: 9 AM - 6 PM */}
              <span className={styles.time}>{t("saturday")}</span>{/* Saturday: 9 AM - 5 PM */}
              <span className={styles.time}>{t("sunday")}</span>{/* Sunday: Closed */}
            </div>

            {/* Newsletter */}
            <div className={styles.widget}>
              <h3>{t("newsletter")}</h3>
              <form className={styles.newsletter}>
                <input type="email" placeholder={t("yourmail")} />
                <button type="submit">{t("send")}</button>
              </form>

              <div className={styles.socials}>
                <a href="https://www.facebook.com/geosurveyservice/?locale=az_AZ"><FaFacebook/></a>
                <a href="https://www.instagram.com/geototal_mmc/"><FaInstagram/></a>
                <a href=""><FaYoutube/></a>
                <a href="https://www.tiktok.com/@geototal.az"><FaTiktok/></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} Geototal LLC. All rights reserved.
</p>
      </div>
    </footer>
  );
}
