"use client";
import {useEffect, useState} from "react";
import ReferenceService from "@/app/services/ReferenceService";

export default function ReferencesAdmin() {
  const [items,setItems]=useState([]);
  const [file,setFile]=useState(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [inputKey,setInputKey]=useState(0);
  useEffect(()=>{
    ReferenceService.getReferenceList().then(({data})=>{
      if(data?.status?.code===200) setItems(data.response || []);
      else setError(data?.status?.message || "Referanslar yüklənmədi.");
    }).catch(()=>setError("Referanslar yüklənmədi. Yenidən cəhd edin."));
  },[]);
  const add=async e=>{
    e.preventDefault();if(busy)return;setError("");
    if(!file){setError("Referans şəkli seçin.");return;}
    setBusy(true);
    try {
      const {data}=await ReferenceService.addReference(file);
      if(data?.status?.code!==200 || !data.response?.id){setError(data?.status?.message || "Referans saxlanmadı.");return;}
      setItems(prev=>[...prev,data.response]);setFile(null);setInputKey(k=>k+1);
    }catch(err){setError(err?.response?.data?.status?.message || "Serverlə əlaqə alınmadı.");}
    finally{setBusy(false);}
  };
  const remove=async id=>{
    if(busy || !confirm("Bu referans silinsin?"))return;
    setBusy(true);setError("");
    try{
      const {data}=await ReferenceService.deleteReference(id);
      if(data?.status?.code!==200){setError(data?.status?.message || "Referans silinmədi.");return;}
      setItems(prev=>prev.filter(item=>item.id!==id));
    }catch(err){setError(err?.response?.data?.status?.message || "Serverlə əlaqə alınmadı.");}
    finally{setBusy(false);}
  };
  return <section style={{padding:24}}>
    <h2>Referans şəkilləri</h2>
    <form onSubmit={add}>
      <label>Yeni referans şəkli <input key={inputKey} type="file" accept="image/*" disabled={busy} onChange={e=>setFile(e.target.files[0] || null)}/></label>
      {error && <p role="alert" style={{color:"#b91c1c"}}>{error}</p>}
      <button type="submit" disabled={busy}>{busy?"Gözləyin…":"Add Reference"}</button>
    </form>
    {!items.length && <p>Hələ referans yoxdur.</p>}
    <div style={{display:"flex",flexWrap:"wrap",gap:20,marginTop:20}}>
      {items.map(item=><div key={item.id}>
        <img src={item.pathName} alt="Referans" style={{width:200,height:160,objectFit:"contain"}}/>
        <div><button disabled={busy} onClick={()=>remove(item.id)}>Delete Reference</button></div>
      </div>)}
    </div>
  </section>;
}
