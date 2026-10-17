import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import CertificateGermany from "@/app/components/section/certificate";
import ServicePageContainer from "@/app/components/section/servicepage";

function ServiceContainer({ page, service, initialData }) {
  return (
    <Layout page={page}>
      <Banner page="services" />
      <ServicePageContainer key={service} service={service} initialData={initialData} />
      {service==="calibration" ? <CertificateGermany/> : ""}
    </Layout>
  );
}

export default ServiceContainer;
