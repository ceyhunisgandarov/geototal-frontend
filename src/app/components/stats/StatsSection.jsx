"use client";
import { useLocale } from "next-intl";
import styles from "../../../../public/assets/css/module/stats/section.module.css";

export default function StatsSection() {
  const locale = useLocale();
  const content = {
    az: {
      title: "Təcrübəmiz rəqəmlərlə",
      desc: "Geodeziya, topoqrafiya və UAV (dron) çəkilişləri üzrə nəticələrimiz.",
      items: [
        { value: "20+", label: "il təcrübə" },
        { value: "50+", label: "layihə" },
        { value: "10000 ha+", label: "PUA ilə aerofotogrammetrik ölçmə" },
      ],
    },
    en: {
      title: "Our Impact in Numbers",
      desc: "Results across surveying, topography and UAV mapping.",
      items: [
        { value: "20+", label: "years of experience" },
        { value: "50+", label: "projects delivered" },
        { value: "10000+ ha", label: "drone survey coverage" },
      ],
    },
    ru: {
      title: "Наш опыт в цифрах",
      desc: "Результаты в геодезии, топографии и БПЛА-съёмке.",
      items: [
        { value: "20+", label: "лет опыта" },
        { value: "50+", label: "реализованных проектов" },
        { value: "10000+ га", label: "съёмки с БПЛА" },
      ],
    },
    ky: {
      title: "Биздин тажрыйба сандарда",
      desc: "Геодезия, топография жана дрон менен съёмка боюнча жыйынтыктарыбыз.",
      items: [
        { value: "20+", label: "жылдык тажрыйба" },
        { value: "50+", label: "долбоор" },
        { value: "10000+ га", label: "дрон менен аэрофотограмметриялык съёмка" },
      ],
    },
  };

  const { title, desc, items } = content[locale] || content.az;

  return (
    <section className={styles.section} aria-label="Statistics">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.desc}>{desc}</p>
        </header>

        <div className={styles.grid}>
          {items.map((item, idx) => (
            <article className={styles.card} key={idx}>
              <div className={styles.value}>{item.value}</div>
              <div className={styles.label}>{item.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
