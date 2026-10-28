import PageHeading from "@/app/components/pageheading";
import CertificateSection from "@/app/components/certificate";
import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";

function CertificateContainer({ page }) {
  return (
    <Layout page={page}>
      <Banner page={page} />
      <PageHeading page="references" />
      <CertificateSection />
    </Layout>
  );
}

export default CertificateContainer;
