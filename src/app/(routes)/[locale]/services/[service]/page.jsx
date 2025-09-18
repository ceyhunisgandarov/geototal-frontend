"use client";
import ServiceContainer from "@/app/containers/service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ServicePage() {
  const params = useParams();
  const { service } = params;

  const [aService, setAService] = useState({});

  useEffect(() => {
    fetch(`jsons/${service}.json`)
      .then((response) => {
        console.log("data", response);
        setAService(response);
      })
      .catch((error) => {
        console.log("something went wrong", error);
      });
  }, []);

  return (
    <section>
      <ServiceContainer
        page={`/services/${service}`}
        service={service}
      />
    </section>
  );
}

export default ServicePage;
