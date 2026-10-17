import HomeContainer from "@/app/containers/homepage";
import {getList,getAbout} from "@/lib/server-content";
export default async function HomePage({params}) {
 const [services,projects,products,about]=await Promise.all([getList('services'),getList('projects'),getList('products'),getAbout('first')]);
 return <HomeContainer page="" locale={params.locale} initialData={{services,projects,products,about}} />;
}
