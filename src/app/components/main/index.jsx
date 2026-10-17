//app/components/main/index.jsx
"use client";
import PageHeading from "@/app/components/pageheading";
import Layout from "../layout";
import HomeBody from "../homebody";
import ModernCarousel from "../moderncarousel";
import ModernService from "../modernservice";
import ModernContact from "../moderncontact";
import AdvertiseArea from "../advertising";
import ClientArea from "../modernclients";
import Projects from "../projects";
import AboutSection from "../modernabout";
import StatsSection from "../stats/StatsSection";

export default function MainSection({ page, locale, initialData }) {
  return (
    <Layout page={page} locale={locale}>
      <ModernCarousel />
      <PageHeading page="home" />
      <StatsSection locale={locale} />
      <AboutSection initialData={initialData?.about} />
      <ModernService initialData={initialData?.services} />
      <ModernContact />
      <AdvertiseArea />
      <HomeBody initialData={initialData?.products} />
      <ClientArea />
      <Projects initialData={initialData?.projects} />
    </Layout>
  );
}
