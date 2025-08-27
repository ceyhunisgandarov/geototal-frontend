"use client";
import { useState, useRef } from "react";

const cards = ["zefer", "hilton", "crescent"];

function ProjectCarousel({ style }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const startX = useRef(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    startX.current = null;
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (startX.current === null) return;
    const diff = startX.current - e.clientX;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    startX.current = null;
  };

  return (
    <div
      className={style.projectContainer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className={style.carouselWrapper}>
        <h1>İştirak etdiyimiz layihələr</h1>
        <div className={style.carousel}>
          {cards.map((card, index) => {
            const relativeIndex =
              (index - activeIndex + cards.length) % cards.length;

            let className = style.card;
            let clickHandler = undefined;

            if (relativeIndex === 0) {
              className += ` ${style.active}`;
            } else if (relativeIndex === 1) {
              className += ` ${style.right}`;
              clickHandler = handleNext;
            } else if (relativeIndex === cards.length - 1) {
              className += ` ${style.left}`;
              clickHandler = handlePrev;
            }

            return (
              <div
                key={index}
                className={`${className} ${style[card]}`}
                onClick={clickHandler}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProjectCarousel;
