import {contentLabels,partHeading} from "../src/lib/content-labels.js";
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
  if(name==="@/lib/content-labels")return {contentLabels,partHeading};
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





const ok=response=>({data:{status:{code:200},response}});
const refFile="src/app/components/admin/section/references/index.jsx";
test("References add and last deletion update list",async()=>{
 const h=mount(refFile,{getReferenceList:ok([]),addReference:ok({id:7,pathName:"image"}),deleteReference:ok("deleted")});h.render();let t=await h.ready();find(t,n=>n.props?.type==="file").props.onChange({target:{files:[new Blob(["image"])]}});t=h.render();await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});t=h.render();assert.ok(find(t,n=>n.type==="img"&&n.props.src==="image"));await find(t,n=>n.type==="button"&&text(n)==="Delete Reference").props.onClick();assert.ok(text(h.render()).includes("Hələ referans yoxdur."));
});
test("Reference errors are red and keep existing items",async()=>{
 const fail={data:{status:{code:400,message:"Rejected"}}};const h=mount(refFile,{getReferenceList:ok([{id:7,pathName:"image"}]),deleteReference:fail,addReference:fail});h.render();let t=await h.ready();await find(t,n=>n.type==="button"&&text(n)==="Delete Reference").props.onClick();t=h.render();assert.ok(find(t,n=>n.type==="img"));assert.equal(find(t,n=>n.props?.role==="alert").props.style.color,"#b91c1c");
});
for(const fail of [false,true])test(`Service deletion ${fail?"failure preserves":"success removes"} card`,async()=>{
 const h=mount("src/app/components/admin/section/service/index.jsx",{getServices:ok([{id:7,serviceName:"Name",serviceParts:[]}]),deleteService:fail?{data:{status:{code:400,message:"Rejected"}}}:ok("deleted")});h.render();let t=await h.ready();await find(t,n=>n.type==="button"&&text(n)==="Delete Service").props.onClick();t=h.render();assert.equal(nodes(t).some(n=>n.type==="button"&&text(n)==="Delete Service"),fail);if(fail)assert.equal(find(t,n=>n.props?.role==="alert").props.style.color,"#b91c1c");
});
test("Deleted public service shows not-found instead of permanent skeleton",async()=>{
 const h=mount("src/app/components/section/servicepage/index.jsx",{getService:{data:{status:{code:404}}}},{service:"missing"});h.render();const t=await h.ready();assert.ok(text(find(t,n=>n.props?.role==="alert")).includes("tapılmadı"));
});
test("Wrappers send correct methods, IDs and multipart field",async()=>{
 for(const file of ["ReferenceService","ServicesService"]){
  const calls=[];const source=readFileSync(new URL(`src/app/services/${file}.jsx`,root),"utf8").replace(/^import .*;\r?\n/gm,"").replace("export default","module.exports =");const module={exports:{}};
  vm.runInNewContext(source,{module,FormData,Cookies:{get:()=>"token"},createAxiosInstance:()=>({post:(...args)=>calls.push(["POST",...args]),delete:(...args)=>calls.push(["DELETE",...args])})});
  if(file==="ReferenceService"){module.exports.addReference(new Blob(["image"]));assert.equal(calls[0][0],"POST");assert.ok(calls[0][2].get("referenceImage"));module.exports.deleteReference(7);assert.equal(calls[1][1],"admin/delete/reference/7");assert.equal(calls[1][0],"DELETE");}
  else {module.exports.deleteService(8);assert.equal(calls[0][1],"admin/delete/service/8");assert.equal(calls[0][0],"DELETE");}
 }
});
test("Service deletion cancellation and pending request block extra writes",async()=>{
 const file="src/app/components/admin/section/service/index.jsx";const row={id:7,serviceName:"Name",serviceParts:[]};
 const cancelled=mount(file,{getServices:ok([row]),deleteService:ok("deleted")},{},"az",null,false);cancelled.render();let t=await cancelled.ready();await find(t,n=>n.type==="button"&&text(n)==="Delete Service").props.onClick();assert.equal(cancelled.calls.filter(c=>c.method==="deleteService").length,0);
 let done;const pending=new Promise(r=>done=r);const h=mount(file,{getServices:ok([row]),deleteService:()=>pending});h.render();t=await h.ready();const p=find(t,n=>n.type==="button"&&text(n)==="Delete Service").props.onClick();t=h.render();const b=find(t,n=>n.type==="button"&&text(n)==="Delete Service");assert.equal(b.props.disabled,true);await b.props.onClick();assert.equal(h.calls.filter(c=>c.method==="deleteService").length,1);done(ok("deleted"));await p;
});
test("Reference upload failure keeps selected file for retry",async()=>{
 const h=mount(refFile,{getReferenceList:ok([]),addReference:{data:{status:{code:400,message:"Upload failed"}}}});h.render();let t=await h.ready();const image=new Blob(["image"]);find(t,n=>n.props?.type==="file").props.onChange({target:{files:[image]}});for(let i=0;i<2;i++){await find(h.render(),n=>n.type==="form").props.onSubmit({preventDefault(){}});}assert.equal(h.calls.filter(c=>c.method==="addReference").length,2);assert.equal(h.calls.filter(c=>c.method==="addReference").at(-1).args[0],image);assert.equal(text(find(h.render(),n=>n.props?.role==="alert")),"Upload failed");
});
