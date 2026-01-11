import Layout from "@/app/components/layout";
import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import ReferencesSection from "@/app/components/section/referencessection";


function ReferencesContainer({page, locale}) {
  return (
    <Layout page={page} locale={locale}>
      <Banner page={page} />
      <ReferencesSection />
    </Layout>
  );
}

export default ReferencesContainer;
