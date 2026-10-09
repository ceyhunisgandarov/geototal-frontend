export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Продукттар" : "Products"} - Geototal` };
}

export default function ProductsLayout({ children }) {
  return <main>{children}</main>;
}