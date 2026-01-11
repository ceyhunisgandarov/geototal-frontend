import Banner from "@/app/components/section/banner";
import AboutUsSection from "@/app/components/section/aboutussection";
import Layout from "@/app/components/layout";

function AboutUsContainer({ page, locale }) {
  return (
    <Layout page={page} locale={locale}>
      <Banner page={page} />
      <AboutUsSection />
    </Layout>
  );
}

export default AboutUsContainer;
