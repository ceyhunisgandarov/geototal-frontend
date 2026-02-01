"use client";
import styles from "../../../../../public/assets/css/module/layout/modernnavbar.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "../../../../../public/images/Geototal_loqo.png";
import azflag from "../../../../../public/images/flag/az-flag.png";
import enflag from "../../../../../public/images/flag/en-flag.png";
import ruflag from "../../../../../public/images/flag/ru-flag.png";
import { useTranslations } from "next-intl";

export default function ModernNavbar({ page }) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);
  const t = useTranslations("Navbar");

  let navbarSticky;

  useEffect(() => {
    checkPage();
  }, []);

  const checkPage = () => {
    if (page !== "") {
      navbarSticky = false;
    }
  };

  const dropdown = () => setLanguageMenu((prev) => !prev);

  // Mobil kontrol
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sticky desktop only
  useEffect(() => {
    if (isMobile) return; // Mobilde sticky kapalı
    const handleScroll = () => {
      setIsSticky(window.scrollY >= 245);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  useEffect(() => {
    if (t("locale") === "az") setFlag(azflag);
    else if (t("locale") === "en") setFlag(enflag);
    else if (t("locale") === "ru") setFlag(ruflag);
    else console.error("Geçersiz dil: ", t("locale"));
  }, [t("locale")]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header
        className={`${styles.header} ${
          !isMobile &&
          (page === ""
            ? isSticky
              ? styles.sticky
              : styles.transparent
            : styles.sticky)
        }`}
      >
        <div className={styles.container}>
          <div className={styles.logo}>
            <Link href={`/${t('locale')}/`}>
              <Image
                className={styles.logoImage}
                src={logo}
                alt="Logo"
                width={130}
                height={60}
                priority
              />
            </Link>
          </div>

          {!isMobile && (
            <nav className={`${styles.menu} ${isSticky ? styles.dark : ""}`}>
              <div className={styles.menuLink}>
                <Link className={styles.mainLink} href={`/${t("locale")}/`}>
                  {t("home")}
                </Link>
              </div>
              <div className={styles.menuLink}>
                <Link
                  className={styles.mainLink}
                  href={`/${t("locale")}/aboutus`}
                >
                  {t("aboutus")}
                </Link>
                <div className={styles.dropDown}>
                  <ul className={styles.unOrderedList}>
                    <li className={styles.dropDownMenu}>
                      <Link
                        className={styles.mainLink}
                        href={`/${t("locale")}/aboutus`}
                      >
                        {t("company")}
                      </Link>
                    </li>
                    <li className={styles.dropDownMenu}>
                      <Link
                        className={styles.mainLink}
                        href={`/${t("locale")}/aboutus/references`}
                      >
                        {t("references")}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={styles.menuLink}>
                <Link
                  className={styles.mainLink}
                  href={`/${t("locale")}/projects`}
                >
                  {t("projects")}
                </Link>
              </div>
              <div className={styles.menuLink}>
                <Link
                  className={styles.mainLink}
                  href={`/${t("locale")}/products`}
                >
                  {t("products")}
                </Link>
              </div>
              <div className={styles.menuLink}>
                <Link
                  className={styles.mainLink}
                  href={`/${t("locale")}/services`}
                >
                  {t("services")}
                </Link>
              </div>
              <div className={styles.menuLink}>
                <Link
                  className={styles.mainLink}
                  href={`/${t("locale")}/contact`}
                >
                  {t("contactus")}
                </Link>
              </div>
              <div className={styles.languageContainer} onClick={dropdown}>
                <div className={styles.selectedLocale}>
                  <Image
                    src={flag}
                    width={300}
                    height={300}
                    alt="flag"
                    className={styles.flag}
                  />
                </div>
                {languageMenu && (
                  <div className={styles.dropdownLocales}>
                    <Link href={`/az/${page}`} onClick={dropdown}>
                      <div className={styles.flagContainer}>
                        <Image
                          src={azflag}
                          width={300}
                          height={300}
                          alt="az-flag"
                          className={styles.flag}
                        />
                      </div>
                    </Link>
                    <Link href={`/en/${page}`} onClick={dropdown}>
                      <div className={styles.flagContainer}>
                        <Image
                          src={enflag}
                          width={300}
                          height={300}
                          alt="en-flag"
                          className={styles.flag}
                        />
                      </div>
                    </Link>
                    <Link href={`/ru/${page}`} onClick={dropdown}>
                      <div className={styles.flagContainer}>
                        <Image
                          src={ruflag}
                          width={300}
                          height={300}
                          alt="ru-flag"
                          className={styles.flag}
                        />
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          )}

          {isMobile && (
            <div className={styles.languageContainer} onClick={dropdown}>
              <div className={styles.selectedLocale}>
                <Image
                  src={flag}
                  width={300}
                  height={300}
                  alt="flag"
                  className={styles.flag}
                />
              </div>
              {languageMenu && (
                <div className={styles.dropdownLocales}>
                  <Link href={`/az/${page}`} onClick={dropdown}>
                    <div className={styles.flagContainer}>
                      <Image
                        src={azflag}
                        width={300}
                        height={300}
                        alt="az-flag"
                        className={styles.flag}
                      />
                    </div>
                  </Link>
                  <Link href={`/en/${page}`} onClick={dropdown}>
                    <div className={styles.flagContainer}>
                      <Image
                        src={enflag}
                        width={300}
                        height={300}
                        alt="en-flag"
                        className={styles.flag}
                      />
                    </div>
                  </Link>
                  <Link href={`/ru/${page}`} onClick={dropdown}>
                    <div className={styles.flagContainer}>
                      <Image
                        src={ruflag}
                        width={300}
                        height={300}
                        alt="ru-flag"
                        className={styles.flag}
                      />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <div className={styles.hamburger} onClick={toggleMenu}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
      </header>

      {/* Mobil Menü */}
      {isMobile && (
        <>
          <div
            className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
          >
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/`}
              onClick={() => setMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/aboutus`}
              onClick={() => setMenuOpen(false)}
            >
              {t("aboutus")}
            </Link>
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/aboutus/references`}
            >
              {t("certificates")}
            </Link>
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/projects`}
              onClick={() => setMenuOpen(false)}
            >
              {t("projects")}
            </Link>
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/products`}
              onClick={() => setMenuOpen(false)}
            >
              {t("products")}
            </Link>
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/services`}
              onClick={() => setMenuOpen(false)}
            >
              {t("services")}
            </Link>
            <Link
              className={styles.mainLink}
              href={`/${t("locale")}/contact`}
              onClick={() => setMenuOpen(false)}
            >
              {t("contactus")}
            </Link>
          </div>
          <div
            className={`${styles.overlay} ${menuOpen ? styles.show : ""}`}
            onClick={toggleMenu}
          ></div>
        </>
      )}
    </>
  );
}
