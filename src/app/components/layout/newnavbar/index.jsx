"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import style from "../../../../../public/assets/css/module/layout/newnavbar.module.css";
import logo from "../../../../../public/images/Geototal_loqo.png";
import azflag from "../../../../../public/images/flag/az-flag.png";
import enflag from "../../../../../public/images/flag/en-flag.png";
import ruflag from "../../../../../public/images/flag/ru-flag.png";
import LogoService from "@/app/services/LogoService";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

function NewNavbar({ page, locale }) {
  const t = useTranslations("Navbar");

  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState(null); // SSR sırasında null

  const toggleDropdown = () => setLanguageMenu((prev) => !prev);

  const [companyLogo, setCompanyLogo] = useState(logo);


  useEffect(() => {
    LogoService.getLogo()
      .then((response) => {
        if (response.data.status.code === 200) {
          setCompanyLogo(
            BASE_IMAGE_URL + response.data.response.url
          );
        } else {
          setCompanyLogo(logo);
        }
      })
      .catch((err) => {
        setCompanyLogo(logo);
      });
  }, []);

  useEffect(() => {
    setDateTime(new Date()); // Client-side başlat
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (locale === "az") setFlag(azflag);
    else if (locale === "en") setFlag(enflag);
    else if (locale === "ru") setFlag(ruflag);
    else console.error("Geçersiz dil:", locale);
  }, [locale]);

  return (
    <div className={`${style.navbar} ${scrolled ? style.scrolled : ""}`}>
      <div className={style.logoWrapper}>
        <span className={style.logoShadow}></span>
        <Link href={`/${t("locale")}/`} className={style.logo}>
          <Image
            src={companyLogo}
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
          <div>
            {dateTime ? (
              <p>
                {dateTime.toLocaleDateString()}, {dateTime.toLocaleTimeString()}
              </p>
            ) : (
              <p>Loading...</p> // SSR sırasında veya client yüklenene kadar göster
            )}
          </div>
          <Link href="mailto:office@geototal.az" className={style.linkmail}>
            <p>office@geototal.az</p>
          </Link>
        </div>

        <div className={style.menu}>
          <div className={style.primaryMenu}>
            <ul>
              <li>
                <Link href={`/${t("locale")}/`} className={style.linkMenu}>
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${t("locale")}/aboutus`}
                  className={style.linkMenu}
                >
                  {t("aboutus")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${t("locale")}/products`}
                  className={style.linkMenu}
                >
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${t("locale")}/services`}
                  className={style.linkMenu}
                >
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${t("locale")}/contact`}
                  className={style.linkMenu}
                >
                  {t("contactus")}
                </Link>
              </li>
            </ul>
          </div>

          <div className={style.languageContainer} onClick={toggleDropdown}>
            <div className={style.selectedLocale}>
              <Image src={flag} alt="flag.png" className={style.flag} />
            </div>
            {languageMenu && (
              <div className={style.dropdownLocales}>
                <Link href={`/az/${page}`} onClick={toggleDropdown}>
                  <div className={style.flagContainer}>
                    <Image src={azflag} alt="az-flag" className={style.flag} />
                  </div>
                </Link>
                <Link href={`/en/${page}`} onClick={toggleDropdown}>
                  <div className={style.flagContainer}>
                    <Image src={enflag} alt="en-flag" className={style.flag} />
                  </div>
                </Link>
                <Link href={`/ru/${page}`} onClick={toggleDropdown}>
                  <div className={style.flagContainer}>
                    <Image src={ruflag} alt="ru-flag" className={style.flag} />
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
              {t("home")}
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link href={`/${t("locale")}/aboutus`} className={style.linkMobile}>
              {t("aboutus")}
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link
              href={`/${t("locale")}/products`}
              className={style.linkMobile}
            >
              {t("products")}
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link
              href={`/${t("locale")}/services`}
              className={style.linkMobile}
            >
              {t("services")}
            </Link>
          </li>
          <li className={style.menuButton}>
            <Link href={`/${t("locale")}/contact`} className={style.linkMobile}>
              {t("contactus")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NewNavbar;
