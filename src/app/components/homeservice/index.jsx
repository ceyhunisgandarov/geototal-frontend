"use client";
import ServicesService from "@/app/services/ServicesService";
import style from "../../../../public/assets/css/module/homeservice/homeservice.module.css";
import Icon from "../elements/icon";
import { useEffect, useRef, useState } from "react";

const icons = ["lidar", "drone-works", "mapping", "geodesy", "geology"];

export default function HomeService() {
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const [wrapperHeight, setWrapperHeight] = useState("100vh");
  const [services, setServices] = useState([]);

  const refreshServices = () => {
    ServicesService.getServices()
      .then((response) => {
        if (response.data.status.code === 200) {
          setServices(response.data.response);
        } else {
          console.log("Something wrong error-", response.data.status.message);
        }
      })
      .catch((error) => {
        console.log("Something wrong error-", error);
      });
  };

  useEffect(() => {
    refreshServices();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const content = contentRef.current;
    if (!video || !content) return;

    const updateHeight = () => {
      const height = content.offsetHeight;
      setWrapperHeight(`${height}px`);
    };

    // İlk yüklemede çalıştır
    updateHeight();

    // Video olayları
    const handleCanPlay = () => {
      video.playbackRate = 2;
      video.play().catch((err) => {
        console.warn("Video autoplay blocked", err);
      });
    };

    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    // ResizeObserver
    const observer = new ResizeObserver(updateHeight);
    observer.observe(content);

    // window resize
    window.addEventListener("resize", updateHeight);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div className={style.wrapper} style={{ height: `${wrapperHeight}` }}>
      <div className={style.sticky}>
        <div className={style.videoContainer}>
          <video
            muted
            playsInline
            autoPlay
            ref={videoRef}
            className={style.video}
            src="/images/Background.mp4"
            preload="auto"
          />
        </div>
      </div>

      <div ref={contentRef} className={style.content}>
        <div className={style.gridContainer}>
          {services.map((service, index) => (
            <Icon
              key={index}
              path={service.serviceImageUrl}
              service={service}
              style={style}
              background="dark"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
