import Carousel from "@/app/components/carousel";
import CompanyAlbum from "@/app/components/companyalbum";
import HomeBody from "@/app/components/homebody";
import HomeService from "@/app/components/homeservice";
import Layout from "@/app/components/layout";
import TestSection from "@/app/components/test";

function HomeContainer({ page, locale }) {
  return <TestSection page={page} locale={locale} />;
}

export default HomeContainer;
