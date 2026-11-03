import Container from "@/app/containers/aboutus";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await Promise.all([getAbout('first'),getAbout('second')]);
 return <Container page="aboutus" locale={params.locale} initialData={data} />;
}
