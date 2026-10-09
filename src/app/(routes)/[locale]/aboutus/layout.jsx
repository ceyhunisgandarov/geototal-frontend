export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Биз жөнүндө" : "About Us"} - Geototal` };
}

export default function AboutUsLayout({ children }) {
  return <main>{children}</main>;
}
