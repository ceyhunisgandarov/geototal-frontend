import 'server-only';
import {cache} from 'react';
import {notFound} from 'next/navigation';

const request = cache(async (endpoint) => {
 const base=process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
 if(!base)throw new Error('Content service is not configured');
 let response;
 try {response=await fetch(`${base.replace(/\/$/,'')}/${endpoint}`,{cache:'no-store',signal:AbortSignal.timeout(8000)});}
 catch {throw new Error('Content service is temporarily unavailable');}
 if(response.status===404)return {status:{code:404}};
 if(!response.ok)throw new Error('Content service is temporarily unavailable');
 let data;
 try {data=await response.json();}catch {throw new Error('Invalid content service response');}
 return data;
});

export const getDetail = cache(async (kind,id) => {
 if(kind==='product' && (!/^[1-9][0-9]*$/.test(String(id)) || BigInt(id)>9223372036854775807n))notFound();
 const endpoints={service:'user/service/get/',project:'user/project/',product:'user/product/'};
 if(!endpoints[kind])throw new Error('Unknown content type');
 const data=await request(endpoints[kind]+encodeURIComponent(id));
 // Legacy service API returns 403 specifically for a missing service.
 const legacyMissing=kind==='service' && data?.status?.code===403 && data.status.message==='Service not found';
 if(data?.status?.code===404 || legacyMissing)notFound();
 if(data?.status?.code!==200 || !data.response || typeof data.response!=='object' || Array.isArray(data.response))throw new Error('Content service is temporarily unavailable');
 return data.response;
});
export const getList = cache(async kind => {
 const endpoints={services:'user/service/get-list',projects:'user/project/list',products:'user/products'};
 if(!endpoints[kind])throw new Error('Unknown content list');
 const data=await request(endpoints[kind]);
 if(kind==='projects' && data?.status?.code===404 && data.status.message==='Empty List')return [];
 if(data?.status?.code!==200 || !Array.isArray(data.response))throw new Error('Content service is temporarily unavailable');
 return data.response;
});
export const getAbout = cache(async step => {
 const data=await request(`user/about/${step}`);
 if(data?.status?.code!==200 || !data.response)throw new Error('Content service is temporarily unavailable');
 return data.response;
});
