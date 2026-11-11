import {headers} from "next/headers";
import {getRequestHost} from "@/lib/locales";
import {seoSite} from "@/lib/seo";
import Container from "@/app/containers/service";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await getDetail('service',params.service);
 return <Container page={`services/${params.service}`} service={params.service} region={seoSite(getRequestHost(headers()),params.locale).origin.endsWith(".kg") ? "KG" : "AZ"} initialData={data} />;
}
