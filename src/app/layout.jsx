import { redirect } from "next/navigation";

export default function RootLayout({ children }) {

  if (typeof window === "undefined") {
    if (globalThis?.location?.pathname === "/") {
      redirect("/az");
    }
  }

  return (
    <html lang="az" style={{ backgroundColor: "#fff", color: "#000" }}>
      <body>{children}</body>
    </html>
  );
}
