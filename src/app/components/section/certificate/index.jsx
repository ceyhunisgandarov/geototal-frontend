import styles from "../../../../../public/assets/css/module/certificate/certificate.module.css";
import ImageLightbox from "../../lightbox";

function CertificateGermany() {
  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.certificateWrap}>
          <ImageLightbox
            src="/images/certificate/servis.jpeg"
            style={styles.certificate}
          />
          <hr/>
          <ImageLightbox
            src="/images/certificate/germany.jpg"
            style={styles.certificate}
          />
        </div>
      </div>
    </div>
  );
}

export default CertificateGermany;
