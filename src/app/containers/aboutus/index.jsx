import PageHeading from "@/app/components/pageheading";
import Banner from "@/app/components/section/banner";
import AboutUsSection from "@/app/components/section/aboutussection";
import Layout from "@/app/components/layout";

function AboutUsContainer({ page, locale, initialData }) {
  return (
    <Layout page={page} locale={locale}>
      <Banner page={page} />
      <PageHeading page="aboutus" />
      <AboutUsSection initialData={initialData} />
    </Layout>
  );
}

export default AboutUsContainer;
