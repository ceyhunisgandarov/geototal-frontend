export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Продукттар" : "Products"} - Geototal` };
}

export default function ProductLayout({ children }) {
  return <main>{children}</main>;
}