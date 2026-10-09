export function generateMetadata({ params }) {
  return { title: `${params.locale === "ky" ? "Долбоорлор" : "Projects"} - Geototal` };
}

export default function ProjectsLayout({ children }) {
  return <main>{children}</main>;
}