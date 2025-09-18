import ContactUsContainer from "@/app/containers/contactus";
import { useTranslations } from "next-intl";

function ContactUsPage() {
  const t = useTranslations("Menu");

  return <div><ContactUsContainer page="contact" /></div>;
}

export default ContactUsPage;
