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

function NewNavbar({ page, locale }) {
  const t = useTranslations("Navbar");
  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(logo);

  const toggleDropdown = () => setLanguageMenu((prev) => !prev);

  useEffect(() => {
    LogoService.getLogo()
      .then((response) => {
        if (response.data.status.code === 200) setCompanyLogo(response.data.response.url);
        else setCompanyLogo(logo);
      })
      .catch(() => setCompanyLogo(logo));
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
  }, [locale]);

  return (
    <header className={`${style.header} ${scrolled ? style.scrolled : ""}`}>
      <div className={style.container}>
        {/* LOGO */}
        <div className={style.logoWrapper}>
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

        {/* NAV LINKS */}
        <nav className={style.nav}>
          <div className={style.primaryMenu}>
            <ul>
              <li><Link href={`/${t("locale")}/`} className={style.linkMenu}>{t("home")}</Link></li>
              <li className={style.dropdownWrapper}>
                <Link href={`/${t("locale")}/aboutus`} className={style.linkMenu}>{t("aboutus")}</Link>
                <ul className={style.dropdownMenu}>
                  <li><Link href={`/${t("locale")}/aboutus`} className={style.dropdownLink}>{t("company")}</Link></li>
                  <li><Link href={`/${t("locale")}/aboutus/references`} className={style.dropdownLink}>{t("references")}</Link></li>
                  <li><Link href={`/${t("locale")}/aboutus/certificates`} className={style.dropdownLink}>{t("certificates")}</Link></li>
                </ul>
              </li>
              <li><Link href={`/${t("locale")}/products`} className={style.linkMenu}>{t("products")}</Link></li>
              <li><Link href={`/${t("locale")}/services`} className={style.linkMenu}>{t("services")}</Link></li>
              <li><Link href={`/${t("locale")}/contact`} className={style.linkMenu}>{t("contactus")}</Link></li>
            </ul>
          </div>

          {/* LANGUAGE SELECTOR */}
          <div className={style.languageContainer} onClick={toggleDropdown}>
            <Image src={flag} alt="flag.png" className={style.flag} />
            {languageMenu && (
              <div className={style.dropdownLocales}>
                <Link href={`/az/${page}`} onClick={toggleDropdown}><Image src={azflag} alt="az" className={style.flag} /></Link>
                <Link href={`/en/${page}`} onClick={toggleDropdown}><Image src={enflag} alt="en" className={style.flag} /></Link>
                <Link href={`/ru/${page}`} onClick={toggleDropdown}><Image src={ruflag} alt="ru" className={style.flag} /></Link>
              </div>
            )}
          </div>

          {/* HAMBURGER */}
          <div className={style.hamburgerContainer} onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`${style.hamburger} ${menuOpen ? style.open : ""}`}>
              <span className={style.hamburgerLine} />
              <span className={style.hamburgerLine} />
              <span className={style.hamburgerLine} />
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className={`${style.mobileMenuContainer} ${menuOpen ? style.open : ""}`}>
          <ul className={style.menuList}>
            <li className={style.menuButton}><Link href={`/${t("locale")}/`} className={style.linkMobile}>{t("home")}</Link></li>
            <li className={style.menuButton} onClick={() => setMobileAboutOpen((prev) => !prev)}>
              <p className={style.linkMobile}>{t("aboutus")}</p>
              <ul className={`${style.dropdownMenuMobile} ${mobileAboutOpen ? style.mobileDropdownOpen : ""}`}>
                <li><Link href={`/${t("locale")}/aboutus`} className={style.dropdownLinkMobile}>{t("company")}</Link></li>
                <li><Link href={`/${t("locale")}/aboutus/references`} className={style.dropdownLinkMobile}>{t("references")}</Link></li>
                <li><Link href={`/${t("locale")}/aboutus/certificates`} className={style.dropdownLinkMobile}>{t("certificates")}</Link></li>
              </ul>
            </li>
            <li className={style.menuButton}><Link href={`/${t("locale")}/products`} className={style.linkMobile}>{t("products")}</Link></li>
            <li className={style.menuButton}><Link href={`/${t("locale")}/services`} className={style.linkMobile}>{t("services")}</Link></li>
            <li className={style.menuButton}><Link href={`/${t("locale")}/contact`} className={style.linkMobile}>{t("contactus")}</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default NewNavbar;
