import {getLocale} from "next-intl/server";
export const metadata = {
 title: "GeoTotal",
 icons: {icon: "/favicon.ico", shortcut: "/favicon.ico"},
 verification: {google: "OZoK6Ukm8-Biplzge0H5gCu8RfMvtGyYUGeVF7VaZ8c"},
};
export default async function RootLayout({children}) {
 const locale=await getLocale();
 return <html lang={locale}><head><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" /></head><body>{children}</body></html>;
}
