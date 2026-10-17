import Container from "@/app/containers/product";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await getDetail('product',params.id);
 return <Container page={`products/${params.id}`} id={params.id} initialData={data} />;
}
