import AboutUsContainer from "@/app/containers/aboutus";
import { useTranslations } from "next-intl";

function AboutUsPage() {

  const t = useTranslations("Navbar")

  return (
    <div>
      <AboutUsContainer page="aboutus" locale={t("locale")} />
    </div>
  );
}

export default AboutUsPage;
