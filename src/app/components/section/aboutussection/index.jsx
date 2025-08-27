import style from "../../../../../public/assets/css/module/aboutussection/aboutussection.module.css";
import AboutUsContent from "../../aboutuscontent";
import Members from "../../members";
import SecondAboutUsContent from "../../secondaboutcontent";

function AboutUsSection() {
  return (
    <section className={style.container}>
      <AboutUsContent />
      <SecondAboutUsContent />
      <Members />
    </section>
  );
}

export default AboutUsSection;
