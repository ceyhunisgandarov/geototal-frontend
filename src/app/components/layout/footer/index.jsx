"use client";
import Image from "next/image";
import logo from "../../../../../public/images/Geototal_loqo.png";
import style from "../../../../../public/assets/css/module/layout/footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaRss,
  FaFlickr,
  FaGooglePlusG,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
      <div className={style.footerTop}>
        <div className={style.footerLogo}>
          <Image
            src={logo}
            width={300}
            height={300}
            alt="logo"
            priority
            className={style.logo}
          />
          <p className={style.slogan}>SOLOGAN COMPANY</p>
        </div>
        <div className={style.footerColsWrapper}>
          <div className={style.footerCol}>
            <ul>
              <li>
                <Link href="#">Weebly Themes</Link>
              </li>
              <li>
                <Link href="#">Pre-sale FAQs</Link>
              </li>
              <li>
                <Link href="#">Submit a Ticket</Link>
              </li>
            </ul>
          </div>
          <div className={style.footerCol}>
            <ul>
              <li>
                <Link href="#">Services</Link>
              </li>
              <li>
                <Link href="#">Theme Tweak</Link>
              </li>
            </ul>
          </div>
          <div className={style.footerCol}>
            <ul>
              <li>
                <Link href="#">Showcase</Link>
              </li>
              <li>
                <Link href="#">Widgetkit</Link>
              </li>
              <li>
                <Link href="#">Support</Link>
              </li>
            </ul>
          </div>
          <div className={style.footerCol}>
            <ul>
              <li>
                <Link href="#">About Us</Link>
              </li>
              <li>
                <Link href="#">Contact Us</Link>
              </li>
              <li>
                <Link href="#">Affiliates</Link>
              </li>
              <li>
                <Link href="#">Resources</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr className={style.divider} />

      <div className={style.footerBottom}>
        <div className={style.socialIcons}>
          <Link href="#">
            <FaFacebookF />
          </Link>
          <Link href="#">
            <FaTwitter />
          </Link>
          <Link href="#">
            <FaRss />
          </Link>
          <Link href="#">
            <FaGooglePlusG />
          </Link>
          <Link href="#">
            <FaFlickr />
          </Link>
        </div>
        <p>© Copyright. All rights reserved.</p>
      </div>
      </div>
    </footer>
  );
}
