import Container from "@/app/containers/project";
import {getList,getDetail,getAbout} from "@/lib/server-content";
export default async function Page({params}) {
 const data=await getDetail('project',params.path);
 return <Container page={`projects/${params.path}`} project={params.path} initialData={data} />;
}
