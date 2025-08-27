import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/second.module.css";

function SecondAboutUsContent() {
  return (
    <section className={style.whySection}>
      <div className={style.aboutText}>
        <h4>WHY CHOOSE US</h4>
        <h2>What We Offer Idea For Construction.</h2>
        <p>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form injected humour.
        </p>
        <div className={style.services}>
          <div>
            <h5>Planning</h5>
            <p>Construction Service</p>
          </div>
          <div>
            <h5>Design</h5>
            <p>Architecture Service</p>
          </div>
        </div>
      </div>
      <div className={style.imageWrapper}>
        <Image
          src="/images/aboutus.png"
          alt="Construction Workers"
          width={500}
          height={500}
          className={style.aboutImage}
        />
      </div>
    </section>
  );
}

export default SecondAboutUsContent;
