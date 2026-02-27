"use client";
import Layout from "../layout";
import HomeBody from "../homebody";
import ModernCarousel from "../moderncarousel";
import ModernService from "../modernservice";
import ModernContact from "../moderncontact";
import AdvertiseArea from "../advertising";
import ClientArea from "../modernclients";
import Projects from "../projects";
import AboutSection from "../modernabout";
import WhatsappButton from "../whatsapp";
import StatsSection from "../stats/StatsSection";

export default function MainSection({ page, locale }) {
  return (
    <Layout page={page} locale={locale}>
      <ModernCarousel />
      <StatsSection />
      <AboutSection />
      <ModernService />
      <ModernContact />
      <AdvertiseArea />
      <HomeBody />
      <ClientArea />
      <Projects />
      <WhatsappButton />
    </Layout>
  );
}
