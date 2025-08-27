import AboutUsContainer from "@/app/containers/aboutus";
import { useTranslations } from "next-intl";

function AboutUsPage() {

  const t = useTranslations("Menu")

  return (
    <div>
      <AboutUsContainer page="aboutus" locale={t("locale")} />
    </div>
  );
}

export default AboutUsPage;
