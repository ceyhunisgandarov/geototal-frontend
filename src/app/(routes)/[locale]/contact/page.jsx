import ContactUsContainer from "@/app/containers/contactus";
import { useTranslations } from "next-intl";

function ContactUsPage() {
  const t = useTranslations("Navbar");

  return <div><ContactUsContainer page="contact" /></div>;
}

export default ContactUsPage;
