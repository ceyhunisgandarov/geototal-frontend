import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import HomeContainer from "@/app/containers/homepage";

export default function HomePage() {
  const t = useTranslations("Home");
  return (
    <div>
      <HomeContainer page="" locale={`${t("locale")}`} />
    </div>
  );
}
