"use client";
import LogoService from "@/app/services/LogoService";
import style from "../../../../../public/assets/css/module/layout/navbar.module.css";
import logo from "../../../../../public/images/Geototal_loqo.png";
import azflag from "../../../../../public/images/flag/az-flag.png";
import enflag from "../../../../../public/images/flag/en-flag.png";
import ruflag from "../../../../../public/images/flag/ru-flag.png";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Navbar({ page, locale }) {
  const t = useTranslations("Navbar");

  const [dateTime, setDateTime] = useState(null); // SSR sırasında null

  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(logo);

  const dropdown = () => setLanguageMenu((prev) => !prev);

  useEffect(() => {
    LogoService.getLogo()
      .then((response) => {
        if (response.data.status.code === 200) {
          setCompanyLogo(response.data.response.url);
        } else {
          setCompanyLogo(logo);
        }
      })
      .catch((err) => {
        setCompanyLogo(logo);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDateTime(new Date()); // Client-side başlat
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (t("locale") === "az") setFlag(azflag);
    else if (t("locale") === "en") setFlag(enflag);
    else if (t("locale") === "ru") setFlag(ruflag);
    else console.error("Geçersiz dil: ", t("locale"));
  }, [t("locale")]);

  return (
    <div className={style.navbar}>
      <div className={style.time}>
        <div>
          {dateTime ? (
            <p>
              {dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}
            </p>
          ) : (
            <p>Loading...</p> // SSR sırasında veya client yüklenene kadar göster
          )}
        </div>
        <div className={style.email}>office@gmail.com</div>
      </div>

      <div className={style.navbarMain}>
        <div className={style.logoContainer}>
          <Link href={`/${t("locale")}/`} className={style.logoLink}>
            <Image
              src={companyLogo}
              width={300}
              height={300}
              className={style.logo}
              alt="geototal-logo"
            />
          </Link>
        </div>

        <div className={style.menuContainer}>
          <ul className={style.menuList}>
            <li>
              <Link
                className={style.menuLink}
                href={`/${t("locale")}/`}
                style={{ textTransform: "uppercase" }}
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link className={style.menuLink} href={`/${t("locale")}/aboutus`}>
                {t("aboutus")}
              </Link>
            </li>
            <li>
              <Link
                className={style.menuLink}
                href={`/${t("locale")}/products`}
              >
                {t("products")}
              </Link>
            </li>
            <li>
              <Link
                className={style.menuLink}
                href={`/${t("locale")}/services`}
              >
                {t("services")}
              </Link>
            </li>
            <li>
              <Link className={style.menuLink} href={`/${t("locale")}/contact`}>
                {t("contactus")}
              </Link>
            </li>
          </ul>
        </div>

        <div className={style.languageContainer} onClick={dropdown}>
          <div className={style.selectedLocale}>
            <Image
              src={flag}
              width={300}
              height={300}
              alt="flag"
              className={style.flag}
            />
          </div>
          {languageMenu && (
            <div className={style.dropdownLocales}>
              <Link href={`/az/${page}`} onClick={dropdown}>
                <div className={style.flagContainer}>
                  <Image
                    src={azflag}
                    width={300}
                    height={300}
                    alt="az-flag"
                    className={style.flag}
                  />
                </div>
              </Link>
              <Link href={`/en/${page}`} onClick={dropdown}>
                <div className={style.flagContainer}>
                  <Image
                    src={enflag}
                    width={300}
                    height={300}
                    alt="en-flag"
                    className={style.flag}
                  />
                </div>
              </Link>
              <Link href={`/ru/${page}`} onClick={dropdown}>
                <div className={style.flagContainer}>
                  <Image
                    src={ruflag}
                    width={300}
                    height={300}
                    alt="ru-flag"
                    className={style.flag}
                  />
                </div>
              </Link>
            </div>
          )}
        </div>

        <div
          className={style.hamburgerContainer}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`${style.hamburger} ${menuOpen ? style.open : ""}`}>
            <span className={style.hamburgerLine} />
            <span className={style.hamburgerLine} />
            <span className={style.hamburgerLine} />
          </div>
        </div>

        <div
          className={`${style.mobileMenuContainer} ${
            menuOpen ? style.open : ""
          }`}
        >
          <ul className={style.mobileMenuList}>
            <li className={style.mobileMenuItem}>
              <Link href={`/${t("locale")}/`} className={style.mobileLink}>
                {t("home")}
              </Link>
            </li>
            <li className={style.mobileMenuItem}>
              <Link
                href={`/${t("locale")}/aboutus`}
                className={style.mobileLink}
              >
                {t("aboutus")}
              </Link>
            </li>
            <li className={style.mobileMenuItem}>
              <Link
                href={`/${t("locale")}/products`}
                className={style.mobileLink}
              >
                {t("products")}
              </Link>
            </li>
            <li className={style.mobileMenuItem}>
              <Link
                href={`/${t("locale")}/services`}
                className={style.mobileLink}
              >
                {t("services")}
              </Link>
            </li>
            <li className={style.mobileMenuItem}>
              <Link
                href={`/${t("locale")}/contact`}
                className={style.mobileLink}
              >
                {t("contactus")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
