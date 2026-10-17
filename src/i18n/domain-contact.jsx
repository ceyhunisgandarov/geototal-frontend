"use client";
import {createContext,useContext,useState,useEffect} from "react";
import {useLocale} from "next-intl";
import {localizedText} from "@/lib/localizedText";
import BranchContactService from "@/app/services/BranchContactService";
const DomainContactContext=createContext(null);
export function DomainContactProvider({contact,children}) {
 const [saved,setSaved]=useState(null);
 const locale=useLocale();
 useEffect(()=>{
  if(!contact)return;
  let cancelled=false;
  const refresh=()=>BranchContactService.getContact().then(({data})=>{
   if(!cancelled && data?.status?.code===200)setSaved(data.response);
  }).catch(()=>{});
  refresh();window.addEventListener("geototal-contact-updated",refresh);
  return ()=>{cancelled=true;window.removeEventListener("geototal-contact-updated",refresh);};
 },[contact]);
 const value=contact?(saved || contact):null;
 const localized=value?{...value,address:localizedText(value,"address",locale)}:null;
 return <DomainContactContext.Provider value={localized}>{children}</DomainContactContext.Provider>;
}
export function useDomainContact(){return useContext(DomainContactContext);}
