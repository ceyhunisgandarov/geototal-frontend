import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import CertificateGermany from "@/app/components/section/certificate";
import ServicePageContainer from "@/app/components/section/servicepage";

function ServiceContainer({ page, service, initialData, region }) {
  return (
    <Layout page={page}>
      <Banner page="services" />
      <ServicePageContainer key={service} service={service} region={region} initialData={initialData} />
      {service==="kalibrasiya" ? <CertificateGermany/> : ""}
    </Layout>
  );
}

export default ServiceContainer;
