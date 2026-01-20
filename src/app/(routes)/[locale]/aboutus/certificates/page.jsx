import AboutUsContainer from "@/app/containers/aboutus";
import CertificateContainer from "@/app/containers/certificate";
import { useTranslations } from "next-intl";

function CertificatePage() {
  const t = useTranslations("Navbar");

  return (
    <CertificateContainer page="aboutus/certificates" locale={t("locale")} />
  );
}

export default CertificatePage;
