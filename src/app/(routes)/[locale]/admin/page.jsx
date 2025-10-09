import MainService from "@/app/services/MainService";
import { notFound } from "next/navigation";

export default async function FakeAdminPage() {
  try {
    await MainService.getMagicLink();
  } catch (err) {
    console.error(err);
  }

  notFound();
}
