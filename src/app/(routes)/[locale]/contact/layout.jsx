export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Байланыш" : "Contact Us"} - Geototal` };
}

export default function ContactUsLayout({ children }) {
  return <main>{children}</main>;
}
