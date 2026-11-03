import Container from "@/app/containers/products";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await getList('products');
 return <Container page="products" locale={params.locale} initialData={data} />;
}
