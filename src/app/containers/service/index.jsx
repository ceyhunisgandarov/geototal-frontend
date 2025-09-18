import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import ServicePageContainer from "@/app/components/section/servicepage";

function ServiceContainer({ page, service }) {
  return (
    <LayoutSecond page={page}>
      <Banner page="services" />
      <ServicePageContainer service={service} />
    </LayoutSecond>
  );
}

export default ServiceContainer;
