import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getDomainLocales, getRequestHost } from "@/lib/locales";

export default function Home() {
  const { defaultLocale } = getDomainLocales(getRequestHost(headers()));
  redirect(`/${defaultLocale}`);
}
