import {headers} from 'next/headers';
import {getRequestHost} from '@/lib/locales';
import {organizationData,serializeStructuredData} from '@/lib/organization';
import HomeContainer from "@/app/containers/homepage";
import {getList,getAbout} from "@/lib/server-content";
export default async function HomePage({params}) {
 const [services,projects,products,about]=await Promise.all([getList('services'),getList('projects'),getList('products'),getAbout('first')]);
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData(organizationData(getRequestHost(headers()),params.locale))}} /><HomeContainer page="" locale={params.locale} initialData={{services,projects,products,about}} /></>;
}
