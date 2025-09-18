import { useEffect, useState } from "react";
import style from "../../../../../public/assets/css/module/service/servicepage.module.css";

function ServicePageContainer({ service }) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    fetch(`/assets/jsons/${service}.json`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === parseInt(id));
        console.log(found);
        setProduct(found);
      });
  }, [service]);

  return (
    <div className={style.container}>
      <div className={style.body}>

      </div>
    </div>
  );
}

export default ServicePageContainer;
