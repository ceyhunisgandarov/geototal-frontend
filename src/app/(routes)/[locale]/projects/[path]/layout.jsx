export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Долбоор" : "Project"} - Geototal` };
}

export default function ProjectLayout({ children }) {
  return <main>{children}</main>;
}