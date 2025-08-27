"use client";
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

  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const dropdown = () => {
    setLanguageMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (locale === "az") setFlag(azflag);
    else if (locale === "en") setFlag(enflag);
    else if (locale === "ru") setFlag(ruflag);
    else console.error("Geçersiz dil: ", locale);
  }, [locale]);

  return (
    <div className={style.navbar}>
      <div className={style.time}>
        <div className={style.date}>13.08.2025</div>
        <div className={style.email}>office@gmail.com</div>
      </div>
      <div className={style.navbarMain}>
        <div className={style.logoContainer}>
          <Link href={`/${t("locale")}/`} className={style.logoLink}>
            <Image
              src={logo}
              width={300}
              height={300}
              className={style.logo}
              alt="geototal-logo.png"
            />
          </Link>
        </div>
        <div className={style.menuContainer}>
          <ul className={style.menuList}>
            <li className={style.menuButton}>
              <Link href={`/${t("locale")}/`}>Home Page</Link>
            </li>
            <li className={style.menuButton}>
              <Link href={`/${t("locale")}/aboutus`}>About Us</Link>
            </li>
            <li className={style.menuButton}>
              <Link href={`/${t("locale")}/products`}>Products</Link>
            </li>
            <li className={style.menuButton}>
              <Link href={`/${t("locale")}/services`}>Services</Link>
            </li>
            <li className={style.menuButton}>
              <Link href={`/${t("locale")}/contact`}>Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className={style.languageContainer} onClick={dropdown}>
          <div className={style.selectedLocale}>
            <Image
              src={flag}
              width={300}
              height={300}
              alt="flag.png"
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
          <ul className={style.menuListt}>
            <li className={style.menuButtonn}>
              <Link href={`/${t("locale")}/`} className={style.link}>
                Home Page
              </Link>
            </li>
            <li className={style.menuButtonn}>
              <Link href={`/${t("locale")}/aboutus`} className={style.link}>
                About Us
              </Link>
            </li>
            <li className={style.menuButtonn}>
              <Link href={`/${t("locale")}/products`} className={style.link}>
                Products
              </Link>
            </li>
            <li className={style.menuButtonn}>
              <Link href={`/${t("locale")}/services`} className={style.link}>
                Services
              </Link>
            </li>
            <li className={style.menuButtonn}>
              <Link href={`/${t("locale")}/contact`} className={style.link}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
