import {headers} from 'next/headers';
import {getRequestHost} from '@/lib/locales';
import {organizationData,serializeStructuredData} from '@/lib/organization';
import HomeContainer from "@/app/containers/homepage";
import {seoSite} from '@/lib/seo';
import {getList,getAbout,getContact,getBranchContact} from "@/lib/server-content";
export default async function HomePage({params}) {
 const host = getRequestHost(headers());
 const kg = seoSite(host, params.locale).origin.endsWith('.kg');
 const [services,projects,products,about,contact]=await Promise.all([getList('services'),getList('projects'),getList('products'),getAbout('first'),(kg ? getBranchContact() : getContact()).catch(() => null)]);
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeStructuredData(organizationData(host,params.locale,contact))}} /><HomeContainer page="" locale={params.locale} initialData={{services,projects,products,about}} /></>;
}
