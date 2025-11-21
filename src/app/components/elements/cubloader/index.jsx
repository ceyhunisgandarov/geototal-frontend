"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../../../../public/assets/css/module/cubeloader/cubeloader.module.css";

export default function CubeLoader({
  size = 120,
  stepDuration = 600,
  perspective = 700,
  className = "",
  faceClass = "",
}) {
  const half = size / 2;
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);
  const stepIndex = useRef(0);

  // 🧭 Pattern: 1 sağa →, 2 yukarı ↑↑, 1 sola ←, 2 yukarı ↑↑
  const pattern = ["y+", "x+", "x+", "y-", "x+", "x+"];

  useEffect(() => {
    const interval = setInterval(() => {
      const p = pattern[stepIndex.current % pattern.length];

      if (p === "y+") setRy((r) => r - 90); // sağa dön
      else if (p === "y-") setRy((r) => r + 90); // sola dön
      else if (p === "x+") setRx((r) => r + 90); // yukarı
      else if (p === "x-") setRx((r) => r - 90); // aşağı

      stepIndex.current += 1;
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stepDuration]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.wrapper} ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          perspective: `${perspective}px`,
        }}
      >
        <div
          className={styles.scene}
          style={{
            transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
            transition: `transform ${Math.round(
              stepDuration * 0.7
            )}ms ease-in-out`,
          }}
        >
          {/* 1️⃣ Ön */}
          <div
            className={`${styles.face} ${faceClass}`}
            style={{ transform: `translateZ(${half}px)` }}
          >
            1
          </div>

          {/* 2️⃣ Arka */}
          <div
            className={`${styles.face} ${faceClass}`}
            style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}
          >
            <p className={styles.second}>2</p>
          </div>

          {/* 3️⃣ Sağ */}
          <div
            className={`${styles.face} ${faceClass}`}
            style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
          >
            3
          </div>

          {/* 4️⃣ Sol */}
          <div
            className={`${styles.face} ${faceClass}`}
            style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
          >
            <p className={styles.fourth}>4</p>
          </div>

          {/* 5️⃣ Üst */}
          <div
            className={`${styles.face} ${faceClass}`}
            style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
          >
            5
          </div>

          {/* 6️⃣ Alt */}
          <div
            className={`${styles.face} ${faceClass}`}
            style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
          >
            <p className={styles.sixth}>6</p>
          </div>
        </div>
      </div>
    </div>
  );
}
