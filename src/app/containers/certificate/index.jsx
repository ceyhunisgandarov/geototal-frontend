import CertificateSection from "@/app/components/certificate";
import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";

function CertificateContainer({ page }) {
  return (
    <Layout page={page}>
      <Banner page={page} />
      <CertificateSection />
    </Layout>
  );
}

export default CertificateContainer;
