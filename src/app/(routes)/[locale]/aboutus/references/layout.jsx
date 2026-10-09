export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Биздин кардарлар" : "Certificates"} - Geototal` };
}

export default function CertificateUsLayout({ children }) {
  return <main>{children}</main>;
}
