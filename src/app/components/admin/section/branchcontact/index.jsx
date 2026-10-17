"use client";
import {useState,useEffect} from "react";
import BranchContactService from "@/app/services/BranchContactService";
export default function BranchContactAdmin(){
 const [form,setForm]=useState(null);
 const [saving,setSaving]=useState(false);
 const [error,setError]=useState("");
 const [success,setSuccess]=useState(false);
 useEffect(()=>{BranchContactService.getContact().then(({data})=>{
  if(data?.status?.code!==200){setError(data?.status?.message || "KG məlumatları yüklənmədi.");return;}
  setForm(data.response);
 }).catch(()=>setError("KG məlumatları yüklənmədi. Səhifəni yeniləyin."));},[]);
 const change=e=>{setSuccess(false);setForm(prev=>({...prev,[e.target.name]:e.target.value}));};
 const save=async e=>{
  e.preventDefault();if(!form || saving)return;setSaving(true);setError("");setSuccess(false);
  try{
   const {data}=await BranchContactService.saveContact(form);
   if(data?.status?.code!==200){setError(data?.status?.message || "Məlumatlar saxlanmadı.");return;}
   setForm(data.response);setSuccess(true);window.dispatchEvent(new Event("geototal-contact-updated"));
  }catch(err){setError(err?.response?.data?.status?.message || "Serverlə əlaqə alınmadı. Yenidən cəhd edin.");}
  finally{setSaving(false);}
 };
 return <section style={{padding:24}}><h2>Qırğızıstan (KG) əlaqə məlumatları</h2>
  <p>Bu məlumatlar .kg saytının əlaqə bölməsi, footer və WhatsApp keçidlərində göstərilir.</p>
  <form onSubmit={save}>
   <fieldset disabled={!form || saving} style={{display:"grid",gap:12,border:0}}>
    {[["companyName","Şirkət adı"],["address","Ünvan (əsas)"],["addressEn","Ünvan (EN)"],["addressRu","Ünvan (RU)"],["addressKy","Ünvan (KY)"],["whatsappNumber","WhatsApp nömrəsi"]].map(([name,label])=><label key={name}>{label}<input name={name} value={form?.[name] ?? ""} onChange={change}/></label>)}
    {[["phoneNumbers","Telefonlar (hər sətirdə bir, maksimum 3)"],["emailAddress","Emaillər (hər sətirdə bir, maksimum 3)"]].map(([name,label])=><label key={name}>{label}<textarea name={name} value={(form?.[name] || []).join("\n")} onChange={e=>{setSuccess(false);setForm(prev=>({...prev,[name]:e.target.value.split("\n")}));}}/></label>)}
   </fieldset>
   {error && <p role="alert" style={{color:"#b91c1c"}}>{error}</p>}
   {success && <p role="status">KG məlumatları saxlanıldı.</p>}
   <button type="submit" disabled={!form || saving}>{saving?"Saxlanır…":"Save KG Contact"}</button>
  </form>
 </section>;
}
