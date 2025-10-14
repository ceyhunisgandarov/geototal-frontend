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
      <div className={style.container}>
        {/* Logo və Qısa Tanıtım */}
        <div className={style.brand}>
          <h2>GeoTotal</h2>
          <p>Geodeziya və topoqrafik həllər üzrə lider şirkət.</p>
        </div>

        {/* Linklər */}
        <div className={style.links}>
          <div className={style.linkGroup}>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={style.linkGroup}>
            <h4>Support</h4>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>

        {/* Sosial Media */}
        <div className={style.social}>
          <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>

      <div className={style.bottom}>
        &copy; {new Date().getFullYear()} GeoTotal. All rights reserved.
      </div>
    </footer>
  );
}
