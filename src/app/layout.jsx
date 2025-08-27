import { redirect } from "next/navigation";

export default function RootLayout({ children }) {
  if (typeof window === "undefined") {
    if (globalThis?.location?.pathname === "/") {
      redirect("/az");
    }
  }

  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
