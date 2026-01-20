import { useTranslations } from 'next-intl';
import styles from '../../../../public/assets/css/module/aboutussection/certificate.module.css';

const certificates = [
  { id: 1, name: 'Jane Doe', image: '/cert1.jpg' },
  { id: 2, name: 'John Smith', image: '/cert2.jpg' },
  { id: 3, name: 'Alice Johnson', image: '/cert3.jpg' },
  { id: 4, name: 'Bob Brown', image: '/cert4.jpg' },
];

export default function CertificateSection() {

    const t = useTranslations("Navbar")

  return (
    <div className={styles.page}>
        <h3>{t("certificates")}</h3>
      <div className={styles.grid}>
        {certificates.map(cert => (
          <div key={cert.id} className={styles.certificateWrapper}>
            <div className={styles.imageWrapper}>
              <img src={cert.image} alt={cert.name} />
            </div>
            <p className={styles.name}>{cert.name}</p>
          </div>
        ))}
      </div>
      <button>{t("more")}</button>
    </div>
  );
}
