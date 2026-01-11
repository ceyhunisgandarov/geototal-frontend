import ReferencesContainer from "@/app/containers/references";
import { useTranslations } from "next-intl";

function ReferencesPage() {

  const t = useTranslations("Navbar")

  return (
    <div>
      <ReferencesContainer page="aboutus/references" locale={t("locale")} />
    </div>
  );
}

export default ReferencesPage;
