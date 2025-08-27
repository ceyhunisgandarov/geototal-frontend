import Image from "next/image";
import style from "../../../../public/assets/css/module/aboutussection/aboutuscontent.module.css";

function AboutUsContent() {
  return (
    <section className={style.aboutSection}>
      <div className={style.imageWrapper}>
        <Image
          src="/images/aboutus.png"
          alt="Construction Workers"
          width={500}
          height={500}
          className={style.aboutImage}
        />
        <div className={style.projectCount}>
          <h2>60+</h2>
          <p>Project Complete</p>
        </div>
      </div>
      <div className={style.aboutText}>
        <h4>ABOUT US</h4>
        <h2>That’s We’re On Build Of Construction.</h2>
        <p>
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form injected humour.
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
    </section>
  );
}

export default AboutUsContent;
