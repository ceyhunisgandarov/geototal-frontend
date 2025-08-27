"use client";

import Image from "next/image";
import style from "../../../../../public/assets/css/module/layout/newnavbar.module.css";
import logo from "../../../../../public/images/Geototal_loqo.png";
import { useEffect, useState } from "react";
import azflag from "../../../../../public/images/flag/az-flag.png";
import enflag from "../../../../../public/images/flag/en-flag.png";
import ruflag from "../../../../../public/images/flag/ru-flag.png";
import { useTranslations } from "next-intl";
import Link from "next/link";

function NewNavbar({ page, locale }) {
  const t = useTranslations("Navbar");

  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (locale === "az") setFlag(azflag);
    else if (locale === "en") setFlag(enflag);
    else if (locale === "ru") setFlag(ruflag);
    else console.error("Geçersiz dil: ", locale);
  }, [locale]);

  return (
    <div className={`${style.navbar} ${scrolled ? style.scrolled : ""}`}>
      <div className={style.logoWrapper}>
        <span className={style.logoShadow}></span>
        <Link href={`/${t("locale")}/`} className={style.logo}>
          <Image
            src={logo}
            alt="logo.jpg"
            width={3700}
            height={1200}
            priority
            className={style.logoImage}
          />
        </Link>
      </div>
      <div className={style.right}>
        <div className={style.time}>
          <p>14 JUL 2025, 14:24</p>
          <Link href="mailto:office@geototal.az" className={style.linkmail}>
            <p>office@geototal.az</p>
          </Link>
        </div>
        <div className={style.menu}>
          <div className={style.primaryMenu}>
            <ul>
              <li>
                <Link href={`/${t("locale")}/`}>Home Page</Link>
              </li>
              <li className={style.dropdown}>
                <Link href={`/${t("locale")}/aboutus`}>About Us</Link>
                {/* <ul className={style.dropdownMenu}>
                  <li>
                    <Link href={`/${t("locale")}/`}>Projects</Link>
                  </li>
                  <li>
                    <Link href={`/${t("locale")}/`}>Sertificates</Link>
                  </li>
                </ul> */}
              </li>
              <li>
                <Link href={`/${t("locale")}/products`}>Products</Link>
              </li>
              <li>
                <Link href={`/${t("locale")}/services`}>Services</Link>
              </li>
              <li>
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
        </div>
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
        className={`${style.mobileMenuContainer} ${menuOpen ? style.open : ""}`}
      >
        <ul className={style.menuList}>
          <li className={style.menuButton}>
            <Link href={`/${t("locale")}/`} className={style.linkMobile}>
              Home Page
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link href={`/${t("locale")}/aboutus`} className={style.linkMobile}>
              About Us
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link
              href={`/${t("locale")}/products`}
              className={style.linkMobile}
            >
              Products
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link
              href={`/${t("locale")}/services`}
              className={style.linkMobile}
            >
              Services
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link href={`/${t("locale")}/contact`} className={style.linkMobile}>
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NewNavbar;
