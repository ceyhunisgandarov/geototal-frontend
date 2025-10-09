import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import style from "../../public/assets/css/module/main/not-found.module.css";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Image
          src="/images/404illustration.png"
          alt="404 illustration"
          width={400}
          height={300}
          className={style.image}
        />
        <h1 className={style.title}>404</h1>
        <h2 className={style.subtitle}>{t("title")}</h2>
        <p className={style.text}>{t("description")}</p>
        <Link href="/" className={style.button}>
          {t("goHome")}
        </Link>
      </div>
    </div>
  );
}
