import {localizedText} from "../src/lib/localizedText.js";
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const babel = require("next/dist/compiled/babel/core");
const root = new URL("../", import.meta.url);
function mount(file, services, props={}, locale="ky", contact=null, confirmDelete=true) {
 let state=[],cursor=0,effects=[],first=true,effectCursor=0,effectDeps=[];
 const calls=[];
 const react={
  createElement(type,properties,...children){return {type,props:{...properties,children}};},
  useState(initial){const i=cursor++;if(!(i in state))state[i]=typeof initial==="function"?initial():initial;return [state[i],v=>{state[i]=typeof v==="function"?v(state[i]):v;}];},
  useEffect(fn,deps){const i=effectCursor++;if(!deps||!effectDeps[i]||deps.some((value,index)=>value!==effectDeps[i][index]))effects.push(fn);effectDeps[i]=deps;},useRef(){return {current:null};}
 };
 const loader=(name)=>{
  if(name==="@/lib/localizedText")return {localizedText};
  if(name==="react")return react;
  if(name==="next-intl")return {useLocale:()=>locale,useTranslations:()=>key=>key==="locale"?locale:key};
  if(name==="next/navigation")return {useRouter:()=>({push(){},replace(){}})};
  if(name.includes("/services/"))return {__esModule:true,default:new Proxy({}, {get(_,method){return (...args)=>{calls.push({method,args});const value=services[method];return Promise.resolve(typeof value==="function"?value(...args):value??{data:{status:{code:200}}});};}})};
  if(name.endsWith(".css"))return new Proxy({}, {get:(_,key)=>String(key)});
  if(name==="next/image"||name==="next/link"||name.startsWith("../"))return name;
  if(name.startsWith("@babel/runtime/"))return require(name.replace("@babel/runtime/", "next/dist/compiled/@babel/runtime/"));
  return require(name);
 };
 const source=readFileSync(new URL(file,root),"utf8");
 const {code}=babel.transformSync(source,{filename:new URL(file,root).pathname,presets:[[require.resolve("next/babel"),{"preset-env":{modules:"commonjs"}}]],babelrc:false,configFile:false});
 const module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:loader,console:{log(){},warn(){},error(){}},alert(){},confirm:()=>confirmDelete,setTimeout:fn=>fn(),clearTimeout(){},window:{innerWidth:1200,addEventListener(){},removeEventListener(){}},URL,Blob});
 const render=()=>{cursor=0;effectCursor=0;const tree=module.exports.default(props);first=false;return tree;};
 const ready=async()=>{let tree;for(let i=0;i<6&&effects.length;i++){const pending=effects;effects=[];for(const effect of pending)effect();await new Promise(r=>setImmediate(r));tree=render();}return tree??render();};
 return {render,ready,calls};
}
function nodes(tree){if(tree==null||typeof tree!=="object")return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)];}
function find(tree,predicate){const n=nodes(tree).find(predicate);assert.ok(n,"Expected form control not found");return n;}
const text=n=>nodes(n).flatMap(x=>x.props?.children??[]).filter(x=>typeof x==="string").join("");




const fields=["titleEn","titleRu","titleKy","descriptionEn","descriptionRu","descriptionKy"];
const record={id:7,title:"AZ",description:"AZ description",imageUrl:"image",...Object.fromEntries(fields.map(f=>[f,f+" text"]))};
const ok=response=>({data:{status:{code:200},response}});
for(const create of [false,true])test(`Certificate ${create?"create":"edit"} sends translations and keeps draft on error`,async()=>{
 const h=mount("src/app/components/admin/section/certificate/index.jsx",{getCertificateList:ok([record]),addOrUpdateCertificate:{data:{status:{code:400,message:"Upload failed"}}}});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)===(create?"+ Add Certificate":"Update")).props.onClick();t=h.render();
 for(const f of fields){const field=find(t,n=>n.props?.name===f);assert.equal(field.props.value,create?"":record[f]);field.props.onChange({target:{value:"new "+f}});}
 t=h.render();await find(t,n=>n.type==="button"&&text(n)==="Save").props.onClick();t=h.render();const sent=h.calls.find(x=>x.method==="addOrUpdateCertificate").args[0];for(const f of fields){assert.equal(sent[f],"new "+f);assert.equal(find(t,n=>n.props?.name===f).props.value,"new "+f);}assert.equal(find(t,n=>n.props?.role==="alert").props.style.color,"#b91c1c");
});
for(const locale of ["az","en","ru","ky"])test(`Certificate public text selects ${locale}`,async()=>{
 const h=mount("src/app/components/certificate/index.jsx",{getCertificateList:ok([record])},{},locale);h.render();const t=await h.ready();assert.ok(text(t).includes(locale==="az"?record.description:record["description"+locale[0].toUpperCase()+locale.slice(1)]));
});
test("Certificate missing KY falls back to AZ description",()=>assert.equal(localizedText({description:"AZ",descriptionEn:"EN",descriptionRu:"RU",descriptionKy:" "},"description","ky"),"AZ"));
