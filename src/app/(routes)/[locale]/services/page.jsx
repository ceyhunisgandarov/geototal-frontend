import ServicesContainer from "@/app/containers/services";
import { useTranslations } from "next-intl";

function ServicesPage() {
  const t = useTranslations("Menu");

  return (
    <div>
      <ServicesContainer page="services" locale={t("locale")} />
    </div>
  );
}

export default ServicesPage;
