import PageHeading from "@/app/components/pageheading";
import Layout from "@/app/components/layout";
import LayoutSecond from "@/app/components/layout/layoutsecond";
import Banner from "@/app/components/section/banner";
import ContactForm from "@/app/components/section/contactform";

function ContactUsContainer({ page, initialData }) {
  return (
    <Layout page={page}>
      <Banner page={page} />
      <PageHeading page="contact" />
      <ContactForm initialData={initialData} />
    </Layout>
  );
}

export default ContactUsContainer;
