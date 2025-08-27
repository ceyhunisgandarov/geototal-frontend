"use client";
import Layout from "../layout";
import Carousel from "../carousel";
import HomeBody from "../homebody";
import HomeService from "../homeservice";
import CompanyAlbum from "../companyalbum";

export default function ScrollSections({ page, locale }) {
  return (
    <Layout page={page} locale={locale}>
      <Carousel />
      <HomeService />
      <HomeBody />
      <CompanyAlbum />
    </Layout>
  );
}
