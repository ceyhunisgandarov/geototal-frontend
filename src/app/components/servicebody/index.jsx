import Image from "next/image";
import style from "../../../../public/assets/css/module/servicescards/container.module.css";
import Icon from "../elements/icon";

const services = [
  {
    id: 1,
    title: "Drone",
    image: "lidar",
    locale: "DRONE",
  },
];

const icons = ["lidar", "drone-works", "mapping", "geodesy", "geology"];


function ServiceBody() {
  return (
    <div className={style.container}>
      <div className={style.serviceContainer}>
        <h1>Services</h1>
        <div className={style.cardContainer}>
          {icons.map((icon, index) => (
            <Icon
              key={index}
              path={`/images/icons/${icon}-icon.svg`}
              name={icon}
              background="light"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceBody;
