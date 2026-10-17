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



const ok=response=>({data:{status:{code:200},response}});
const configs=[
 {name:"contactinfo",get:"getContact",read:{address:"Old",phoneNumbers:["1"],emailAddress:["a"],mailAddressForSend:"a",googleEmbeddedLink:""},save:"addOrUpdateContact",open:"Düzenle",button:"Kaydet",field:n=>n.props?.name==="address"},
 {name:"aboutus",get:"getAboutInfo",read:{title:"Old"},save:"addOrUpdateAboutInfo",open:"Change or Add",button:"Kaydet",field:n=>n.props?.name==="title"},
 {name:"products",get:"getProducts",read:[],save:"addOrUpdateProduct",open:"Add new product",button:"Save",field:n=>n.props?.placeholder==="Brand"},
 {name:"carousel",get:"getCarouselData",read:[],save:"addOrUpdateCarousel",open:"Add",button:"Save",field:n=>n.props?.name==="title"}
];
async function prepare(c,result){const h=mount(`src/app/components/admin/section/${c.name}/index.jsx`,{[c.get]:ok(c.read),[c.save]:result});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)===c.open).props.onClick();t=h.render();const field=find(t,c.field);field.props.onChange({target:{name:field.props.name,value:"Keep this text"}});return h;}
function submit(h,c){const t=h.render();const form=nodes(t).find(n=>n.type==="form");return form?form.props.onSubmit({preventDefault(){}}):find(t,n=>n.type==="button"&&text(n)===c.button).props.onClick();}
for(const c of configs){
 for(const kind of ["business","http","network"]){test(`${c.name}: ${kind} error appears red above Save and keeps text`,async()=>{
  const reason="Şəkil yüklənmədi";
  const result=()=>kind==="business"?{data:{status:{code:400,message:reason}}}:Promise.reject(kind==="http"?{response:{data:{status:{message:reason}}}}:new Error("Network Error"));
  const h=await prepare(c,result);await submit(h,c);const t=h.render();const a=find(t,n=>n.props?.role==="alert");assert.equal(a.props.style.color,"#b91c1c");assert.ok(text(a).includes(kind==="network"?"Serverlə əlaqə":reason));assert.equal(find(t,c.field).props.value,"Keep this text");
  const list=nodes(t);assert.ok(list.indexOf(a)<list.indexOf(find(t,n=>n.type==="button"&&text(n)===c.button)));
 });}
 test(`${c.name}: pending save blocks retry, success closes edit`,async()=>{
  let finish;const p=new Promise(r=>finish=r);const h=await prepare(c,()=>p);const request=submit(h,c);let t=h.render();assert.equal(find(t,n=>n.type==="button"&&text(n)===c.button).props.disabled,true);await submit(h,c);assert.equal(h.calls.filter(x=>x.method===c.save).length,1);finish(ok({}));await request;t=h.render();assert.equal(nodes(t).some(n=>n.type==="button"&&text(n)===c.button),false);
 });
}
