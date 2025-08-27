import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import AboutUsSection from "@/app/components/section/aboutussection";

function AboutUsContainer({ page, locale }) {
  return (
    <LayoutSecond page={page} locale={locale}>
      <Banner page={page} />
      <AboutUsSection />
    </LayoutSecond>
  );
}

export default AboutUsContainer;
