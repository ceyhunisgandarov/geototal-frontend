import styles from "../../../../../public/assets/css/module/reference/style.module.css";
import ImageLightbox from "../../lightbox";

function ReferenceLetter({src}) {
  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.certificateWrap}>
          <ImageLightbox
            src={src}
            style={styles.certificate}
          />
        </div>
      </div>
    </div>
  );
}

export default ReferenceLetter;