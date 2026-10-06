"use client";
import LogoService from "@/app/services/LogoService";
import style from "../../../../../../public/assets/css/module/admin/navbar.module.css";
import logo from "../../../../../../public/images/Geototal_loqo.png";
import azflag from "../../../../../../public/images/flag/az-flag.png";
import enflag from "../../../../../../public/images/flag/en-flag.png";
import { usePathname, useRouter } from "next/navigation";
import { switchLocalePath } from "@/lib/locales";
import kyflag from "../../../../../../public/images/flag/ky-flag.png";
import ruflag from "../../../../../../public/images/flag/ru-flag.png";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

function AdminNavbar({ handleClick }) {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const selectLocale = (language, event) => {
    event.stopPropagation();
    setLanguageMenu(false);
    router.replace(switchLocalePath(pathname, language));
  };

  const [flag, setFlag] = useState(azflag);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [logoDb, setLogoDb] = useState(logo);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const dropdown = () => setLanguageMenu((prev) => !prev);

  useEffect(() => {
    refreshLogo;
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const refreshLogo = () => {
    LogoService.getLogo()
      .then((res) => {
        const data = res.data.response;
        if (data?.url) {
          setLogoDb(data.url);
        }
      })
      .catch(console.log);
  };

  const handleSave = () => {
    if (!selectedFile) return;

    LogoService.changeLogo({ description: "logo.jpg" }, selectedFile)
      .then((res) => {
        if (res.data.status.code === 200) {
          refreshLogo;
        } else {
          setErrorMessage(res.data.status.message);
        }
      })
      .catch((err) => {
        console.log("Logo change error", err);
        setErrorMessage("Unexpected error occurred");
      })
      .finally(() => setShowModal(false));
  };

  useEffect(() => {
    if (locale === "az") setFlag(azflag);
    else if (locale === "en") setFlag(enflag);
    else if (locale === "ru") setFlag(ruflag);
    else if (locale === "ky") setFlag(kyflag);
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
          <div
            className={style.logoContainer}
            onClick={() => setShowModal(true)}
          >
            <Image
              src={logoDb}
              alt="logo"
              className={style.logoImage}
              width={150}
              height={150}
            />
            <div className={style.changeOverlay}>Change</div>
          </div>
          {showModal && (
            <div className={style.modalOverlay}>
              <div className={style.modalContent}>
                <h3>Change Logo</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className={style.modalActions}>
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                  <button onClick={handleSave} disabled={!selectedFile}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error alert */}
          {errorMessage && (
            <div className={style.errorAlert}>{errorMessage}</div>
          )}
        </div>

        <div className={style.menuContainer}>
          <ul className={style.menuList}>
            <li>
              <div
                className={style.menuLink}
                onClick={() => handleClick("home")}
              >
                Home Page
              </div>
            </li>
            <li>
              <div
                className={style.menuLink}
                onClick={() => handleClick("about")}
              >
                About Us
              </div>
            </li>
            <li>
              <div
                className={style.menuLink}
                onClick={() => handleClick("product")}
              >
                Products
              </div>
            </li>
            <li>
              <div
                className={style.menuLink}
                onClick={() => handleClick("projects")}
              >
                Projects
              </div>
            </li>
            <li>
              <div
                className={style.menuLink}
                onClick={() => handleClick("service")}
              >
                Services
              </div>
            </li>
            <li>
              <div
                className={style.menuLink}
                onClick={() => handleClick("contact")}
              >
                Contact Us
              </div>
            </li>
            <li><div className={style.menuLink} onClick={() => handleClick("blog")}>Blog</div></li>
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
              {[["az", azflag], ["en", enflag], ["ru", ruflag], ["ky", kyflag]].map(([language, image]) => (
                <button type="button" key={language} aria-label={language.toUpperCase()}
                  onClick={(event) => selectLocale(language, event)}>
                  <Image src={image} width={300} height={300} alt={`${language}-flag`} className={style.flag} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
