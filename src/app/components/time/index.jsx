'use client';

import { useEffect, useState } from "react";
import style from "../../../../public/assets/css/module/timeside/time.module.css";
import Link from "next/link";

function TimeSide() {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.dateTimeContainer}>{dateTime}</div>
      <Link href="mailto:office@geototal.az" className={style.emailLink}>
        office@geototal.az
      </Link>
    </div>
  );
}

export default TimeSide;
