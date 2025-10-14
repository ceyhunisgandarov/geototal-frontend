"use client";
import ServiceContainer from "@/app/containers/service";
import ServicesService from "@/app/services/ServicesService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ServicePage() {
  const params = useParams();
  const { service } = params;


  return (
    <section>
      <ServiceContainer page={`/services/${service}`} service={service} />
    </section>
  );
}

export default ServicePage;
