import style from "../../../../../public/assets/css/module/aboutussection/aboutussection.module.css";
import AboutUsContent from "../../aboutuscontent";
import Members from "../../members";
import SecondAboutUsContent from "../../secondaboutcontent";

function AboutUsSection({initialData} = {}) {
  return (
    <section className={style.container}>
      <AboutUsContent initialData={initialData?.[0]} />
      <SecondAboutUsContent initialData={initialData?.[1]} />
      {/* <Members /> */}
    </section>
  );
}

export default AboutUsSection;
