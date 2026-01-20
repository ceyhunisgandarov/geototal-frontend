"use client";
import AdminCarousel from "@/app/components/admin/section/carousel";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import LoginService from "@/app/services/LoginService";
import { useTranslations } from "next-intl";
import AdminLayout from "@/app/components/admin/layout";
import CollaborationEditSection from "@/app/components/admin/section/collaborationadmin";
import AboutUsAdmin from "@/app/components/admin/section/aboutus";
import MembersAdmin from "@/app/components/admin/section/members";
import ProductsAdmin from "@/app/components/admin/section/products";
import BannerAdmin from "@/app/components/admin/section/banneradmin";
import ContactInfoSection from "@/app/components/admin/section/contactinfo";
import ServiceAdmin from "@/app/components/admin/section/service";
import CertificatesAdmin from "@/app/components/admin/section/certificates";
import ProjectsAdmin from "@/app/components/admin/section/projects";

function AdminHomePage({ page }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [divId, setDivId] = useState("home");
  const t = useTranslations("Admin");

  const handleClick = (divname) => {
    setDivId(divname);
  };

  useEffect(() => {
    const token = Cookies.get("Authorization");
    if (!token) {
      setLoading(false);
      router.push("/404");
      return;
    }

    LoginService.getAdmin(token)
      .then((response) => {
        setUser(response.data.response);
        setLoading(false);
      })
      .catch((err) => {
        Cookies.remove("Authorization");
        setLoading(false);
        router.push("/404");
      });
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AdminLayout page={page} handleClick={handleClick}>
      <div className="wrapper">
        <div style={{ height: "120px" }}></div>
        <div style={{ display: divId === "home" ? "block" : "none" }} id="home">
          <AdminCarousel />
          <CollaborationEditSection />
        </div>
        <div
          style={{ display: divId === "about" ? "block" : "none" }}
          id="about"
        >
          <BannerAdmin page="aboutus" />
          <AboutUsAdmin />
          <MembersAdmin />
          <CertificatesAdmin />
          <BannerAdmin page="aboutus/certificates" />
        </div>
        <div
          style={{ display: divId === "projects" ? "block" : "none" }}
          id="projects"
        >
          <BannerAdmin page="projects" />
          <ProjectsAdmin />
        </div>
        <div
          style={{ display: divId === "product" ? "block" : "none" }}
          id="product"
        >
          <BannerAdmin page="product" />
          <ProductsAdmin />
        </div>
        <div
          style={{ display: divId === "service" ? "block" : "none" }}
          id="service"
        >
          <BannerAdmin page="service" />
          <ServiceAdmin />
        </div>
        <div
          style={{ display: divId === "contact" ? "block" : "none" }}
          id="contact"
        >
          <BannerAdmin page="contact" />
          <ContactInfoSection />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHomePage;
