import Head from "next/head";

export const metadata = {
  title: "Main Page - Geototal",
  icons: {
    icon: "/favicon.ico", // favicon burada təyin olunur
    shortcut: "/favicon.ico", // shortcut icon (mobil üçün)
  },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <Head>
        <title>Main Page - Geototal</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>{children}</body>
    </html>
  );
}
