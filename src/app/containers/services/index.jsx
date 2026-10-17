import Layout from "@/app/components/layout";
import Banner from "@/app/components/section/banner";
import ServiceBody from "@/app/components/servicebody";

const imageDrone = "/images/drone-works.jpeg";

function ServicesContainer({ page, locale, initialData }) {
  return (
    <Layout page={page} locale={locale}>
      <Banner page={page} />
      <ServiceBody initialData={initialData} />
    </Layout>
  );
}

export default ServicesContainer;
