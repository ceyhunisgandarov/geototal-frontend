import styles from "../../../../public/assets/css/module/stats/section.module.css";

export default function StatsSection({ locale = "az" }) {
  const content = {
    az: {
      title: "Təcrübəmiz rəqəmlərlə",
      desc: "Geodeziya, topoqrafiya və UAV (dron) çəkilişləri üzrə nəticələrimiz.",
      items: [
        { value: "15+", label: "il təcrübə" },
        { value: "30+", label: "layihə" },
        { value: "5000 ha+", label: "PUA ilə aerofotogrammetrik ölçmə" },
      ],
    },
    en: {
      title: "Our Impact in Numbers",
      desc: "Results across surveying, topography and UAV mapping.",
      items: [
        { value: "15+", label: "years of experience" },
        { value: "30+", label: "projects delivered" },
        { value: "5000+ ha", label: "drone survey coverage" },
      ],
    },
    ru: {
      title: "Наш опыт в цифрах",
      desc: "Результаты в геодезии, топографии и БПЛА-съёмке.",
      items: [
        { value: "15+", label: "лет опыта" },
        { value: "30+", label: "реализованных проектов" },
        { value: "5000+ га", label: "съёмки с БПЛА" },
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