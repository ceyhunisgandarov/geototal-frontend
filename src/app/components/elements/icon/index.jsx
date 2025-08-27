// import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

function Icon({
  color = "#E41D2D",
  path,
  width = "150px",
  height = "150px",
  name,
  style,
}) {
//   const t = useTranslations(name);

  const iconRef = useRef(null);

  useEffect(() => {
    fetch(path)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // SVG içindeki tüm path, rect, circle gibi elementlerin fill rengini ayarlayın
        const svgPaths = svgElement.querySelectorAll("path, rect, circle");
        svgPaths.forEach((path) => {
          path.setAttribute("fill", color);
        });

        svgElement.setAttribute("width", width);
        svgElement.setAttribute("height", height);

        // SVG içeriğini temizleyip yeniden ekleyin
        iconRef.current.innerHTML = "";
        iconRef.current.appendChild(svgElement);
      })
      .catch((error) => console.error("Error fetching SVG:", error));
  }, [color, path, width, height]);

  return (
    <div className={style.gridItem}>
      <div ref={iconRef}></div>
      <div className={style.contentElement} style={{ zIndex: "2" }}>
        <p className={style.serviceTitle}>lorem ispum</p>
        <p className={style.serviceText}>
          lorem ispum lorem ispum lorem ispumlorem ispum lorem ispum lorem
          ispum lorem ispum
        </p>
      </div>
    </div>
  );
}

export default Icon;
