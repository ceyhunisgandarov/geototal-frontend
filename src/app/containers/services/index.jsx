import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import ServiceBody from "@/app/components/servicebody";

const imageDrone = "/images/drone-works.jpeg";

function ServicesContainer({ page, locale }) {
  return (
    <Layout page={page} locale={locale}>
      <Banner page={page} />
      <ServiceBody/>
    </Layout>
  );
}

export default ServicesContainer;
