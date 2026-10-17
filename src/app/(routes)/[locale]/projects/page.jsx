import Container from "@/app/containers/projects";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await getList('projects');
 return <Container page="projects" initialData={data} />;
}
