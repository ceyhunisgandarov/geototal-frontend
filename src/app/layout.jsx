import { redirect } from "next/navigation";

export default function RootLayout({ children }) {
  if (typeof window === "undefined") {
    if (globalThis?.location?.pathname === "/") {
      redirect("/az");
    }
  }

  return (
    <html lang="az">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
