import {getDetail} from "./server-content";
import 'server-only';
import {headers} from 'next/headers';
import {getRequestHost} from './locales';
import {pageMetadata} from './seo';
import {localizedText} from './localizedText';

export function staticMetadata(locale,page,path='') {
 return pageMetadata({host:getRequestHost(headers()),locale,page,path});
}

export async function detailMetadata(locale,kind,id) {
 const pages={service:'services',project:'projects',product:'products'};
 const page=pages[kind];
 const path=`${page}/${encodeURIComponent(id)}`;
 const record=await getDetail(kind,id);
 const title=kind==='service'?localizedText(record,'serviceName',locale):kind==='project'?localizedText(record,'projectName',locale):[record?.brand,record?.model].filter(Boolean).join(' ');
 const description=kind==='service'?localizedText(record?.serviceParts?.slice().sort((a,b)=>a.id-b.id)[0],'serviceText',locale,'serviceTextAz'):kind==='project'?localizedText(record,'worksDescription',locale):localizedText(record,'description',locale,'descriptionAz');
 return pageMetadata({host:getRequestHost(headers()),locale,page,path,title,description});
}
