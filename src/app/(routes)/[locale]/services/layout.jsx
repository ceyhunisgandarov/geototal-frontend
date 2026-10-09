export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Кызматтар" : "Services"} - Geototal` };
}

export default function ServicesLayout({ children }) {
  return <main>{children}</main>;
}