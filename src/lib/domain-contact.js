import { getDomainLocales } from "./locales.js";

export function getDomainContact(host = "") {
  if (getDomainLocales(host).defaultLocale !== "ky") return null;
  return {
    companyName: 'Филиал ООО «Гео Тотал» в Кыргызской Республике',
    address: "Кыргызская Республика, г. Бишкек, Октябрьский район, ул. Горького, 50, 61",
    phoneNumbers: ["+994 50 235 19 94", "+996 703 448 444", "+994 55 208 97 94"],
    emailAddress: ["info@geototal.kg"],
    whatsappNumber: "+996 703 448 444",
    whatsappUrl: "https://wa.me/996703448444",
  };
}
