"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../../public/assets/css/module/whatsapp/index.module.css";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

export default function WhatsappButton() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setRipples((prev) => [...prev, id]);

      // 1 saniye sonra ripple’i kaldır
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r !== id));
      }, 1000);
    }, 2500); // 2.5 saniye aralıklarla

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.whatsappWrapper}>
      {ripples.map((r) => (
        <span key={r} className={styles.ripple}></span>
      ))}

      <Link
        href="https://wa.me/+994552053403" // kendi numaranı buraya yaz
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
      >
        <FaWhatsapp size={28} />
      </Link>
    </div>
  );
}
