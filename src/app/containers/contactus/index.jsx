import Layout from "@/app/components/layout";
import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import ContactForm from "@/app/components/section/contactform";

function ContactUsContainer({ page }) {
  return (
    <Layout page={page}>
      <Banner page={page} />
      <ContactForm />
    </Layout>
  );
}

export default ContactUsContainer;
