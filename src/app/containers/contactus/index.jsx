import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import ContactForm from "@/app/components/section/contactform";

function ContactUsContainer({ page }) {
  return (
    <LayoutSecond page={page}>
      <Banner page={page} />
      <ContactForm />
    </LayoutSecond>
  );
}

export default ContactUsContainer;
