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




const file="src/app/components/admin/section/service/index.jsx";
const ok=response=>({data:{status:{code:200},response}});
const record=()=>({id:7,serviceName:"AZ",serviceNameEn:"EN",serviceNameRu:"RU",pathName:"service",serviceParts:[{id:11,partName:"Original",serviceTextAz:"AZ",serviceTextEn:"EN",serviceTextRu:"RU",serviceTextKy:"KY",serviceImageUrl:"old-image"}]});
async function setup(result=ok({})){const service=record();const h=mount(file,{getServices:ok([service]),addOrUpdateService:result});h.render();await h.ready();find(h.render(),n=>n.type==="button"&&text(n)==="Update").props.onClick();return {h,service};}
function reopen(h){find(h.render(),n=>n.type==="button"&&text(n)==="Cancel").props.onClick();find(h.render(),n=>n.type==="button"&&text(n)==="Update").props.onClick();return h.render();}
test("Cancel discards part text and file without mutating loaded service",async()=>{
 const {h,service}=await setup();let t=h.render();
 find(t,n=>n.props?.placeholder==="Part Name").props.onChange({target:{value:"Draft"}});
 find(t,n=>n.props?.placeholder==="Service Text KY").props.onChange({target:{value:"Draft KY"}});
 nodes(h.render()).filter(n=>n.props?.type==="file").at(-1).props.onChange({target:{files:[new Blob(["image"])]}});
 assert.equal(service.serviceParts[0].partName,"Original");assert.equal(service.serviceParts[0].serviceTextKy,"KY");assert.equal(service.serviceParts[0].serviceImageFile,undefined);
 t=reopen(h);assert.equal(find(t,n=>n.props?.placeholder==="Part Name").props.value,"Original");assert.equal(find(t,n=>n.props?.placeholder==="Service Text KY").props.value,"KY");assert.equal(find(t,n=>n.props?.alt==="Service Part").props.src,"old-image");assert.equal(h.calls.filter(c=>c.method==="addOrUpdateService").length,0);
});
test("Cancel restores removed parts and discards added parts",async()=>{
 const {h}=await setup();find(h.render(),n=>n.type==="button"&&text(n)==="Delete Part").props.onClick();let t=reopen(h);assert.equal(find(t,n=>n.props?.placeholder==="Part Name").props.value,"Original");find(t,n=>n.type==="button"&&text(n)==="Add Part").props.onClick();assert.equal(nodes(h.render()).filter(n=>n.props?.placeholder==="Part Name").length,2);t=reopen(h);assert.equal(nodes(t).filter(n=>n.props?.placeholder==="Part Name").length,1);
});
test("Saving modified part retains ID and sends draft without altering loaded record",async()=>{
 const {h,service}=await setup();find(h.render(),n=>n.props?.placeholder==="Service Text KY").props.onChange({target:{value:"New KY"}});const updates=nodes(h.render()).filter(n=>n.type==="button"&&text(n)==="Update");await updates.at(-1).props.onClick();const saved=h.calls.find(c=>c.method==="addOrUpdateService");assert.equal(saved.args[2][0].id,11);assert.equal(saved.args[2][0].serviceTextKy,"New KY");assert.equal(service.serviceParts[0].serviceTextKy,"KY");
});

for(const kind of ["business","http","network"]){test(`Service ${kind} error stays red above Update and preserves draft`,async()=>{
 const failure=()=>kind==="business"?{data:{status:{code:400,message:"Upload failed"}}}:Promise.reject(kind==="http"?{response:{data:{status:{message:"Upload failed"}}}}:new Error("offline"));
 const {h}=await setup(failure);find(h.render(),n=>n.props?.placeholder==="Service Text KY").props.onChange({target:{value:"Draft KY"}});
 await nodes(h.render()).filter(n=>n.type==="button"&&text(n)==="Update").at(-1).props.onClick();const t=h.render();const a=find(t,n=>n.props?.role==="alert");assert.equal(a.props.style.color,"#b91c1c");assert.ok(text(a).includes(kind==="network"?"Serverlə əlaqə":"Upload failed"));assert.equal(find(t,n=>n.props?.placeholder==="Service Text KY").props.value,"Draft KY");assert.ok(nodes(t).indexOf(a)<nodes(t).indexOf(nodes(t).filter(n=>n.type==="button"&&text(n)==="Update").at(-1)));
});}
test("Service validation explains missing part and does not submit",async()=>{
 const {h}=await setup();find(h.render(),n=>n.props?.placeholder==="Part Name").props.onChange({target:{value:""}});await nodes(h.render()).filter(n=>n.type==="button"&&text(n)==="Update").at(-1).props.onClick();assert.ok(text(find(h.render(),n=>n.props?.role==="alert")).includes("1-ci hissənin"));assert.equal(h.calls.filter(x=>x.method==="addOrUpdateService").length,0);
});
test("Service pending save blocks retry and success closes form",async()=>{
 let done;const p=new Promise(r=>done=r);const {h}=await setup(()=>p);const request=nodes(h.render()).filter(n=>n.type==="button"&&text(n)==="Update").at(-1).props.onClick();const button=nodes(h.render()).filter(n=>n.type==="button"&&text(n)==="Update").at(-1);assert.equal(button.props.disabled,true);assert.equal(find(h.render(),n=>n.type==="button"&&text(n)==="Cancel").props.disabled,true);await button.props.onClick();assert.equal(h.calls.filter(x=>x.method==="addOrUpdateService").length,1);done(ok({}));await request;assert.equal(nodes(h.render()).some(n=>n.type==="button"&&text(n)==="Cancel"),false);
});
