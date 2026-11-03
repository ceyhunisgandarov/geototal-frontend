import Container from "@/app/containers/services";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await getList('services');
 return <Container page="services" locale={params.locale} initialData={data} />;
}
