import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import ServicePageContainer from "@/app/components/section/servicepage";

function ServiceContainer({ page, service }) {
  return (
    <Layout page={page}>
      <Banner page="services" />
      <ServicePageContainer service={service} />
    </Layout>
  );
}

export default ServiceContainer;
