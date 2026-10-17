// components/AdvertiseArea.jsx
import { useTranslations } from "next-intl";
import styles from "../../../../public/assets/css/module/modern/advertising.module.css";

export default function AdvertiseArea() {
  const t = useTranslations("Advertise")
  return (
    <section className={styles.advertiseArea}>
      <div className={styles.container}>
        <div className={styles.text}>
          <h2>{t("title")}</h2>
          <p>
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
