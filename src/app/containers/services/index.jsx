import Header from "@/app/components/header";
import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import ServiceBody from "@/app/components/servicebody";

const imageDrone = "/images/drone-works.jpeg";

function ServicesContainer({ page, locale }) {
  return (
    <LayoutSecond page={page} locale={locale}>
      <Banner page={page} />
      <ServiceBody page/>
    </LayoutSecond>
  );
}

export default ServicesContainer;
