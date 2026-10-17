import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import vm from "node:vm";
const require = createRequire(import.meta.url);
const babel = require("next/dist/compiled/babel/core");
import {bannerPageKey} from "../src/lib/bannerPage.js";
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
  if(name==="@/lib/bannerPage")return {bannerPageKey};
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


const file="src/app/components/admin/section/banneradmin/index.jsx";
const record={data:{status:{code:200},response:{id:5,title:"product",imageUrl:"existing"}}};
for(const [page,key] of [["product","products"],["service","services"],["aboutus/references","references"],["contact","contact"]]) {
 test(`Banner first load uses ${key}`,async()=>{
  const h=mount(file,{getBanner:record},{page});h.render();await h.ready();
  assert.equal(h.calls.find(c=>c.method==="getBanner").args[0],key);
 });
}
test("Banner saves existing ID and fixed canonical page key",async()=>{
 const h=mount(file,{getBanner:record,addOrUpdateBanner:record},{page:"products"});h.render();let t=await h.ready();
 find(t,n=>n.type==="button"&&text(n)==="Change").props.onClick();t=h.render();
 assert.equal(nodes(t).filter(n=>n.props?.name==="title").length,0);
 find(t,n=>n.props?.name==="file").props.onChange({target:{files:["file"]}});t=h.render();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 const sent=h.calls.find(c=>c.method==="addOrUpdateBanner");assert.equal(sent.args[2],5);assert.equal(sent.args[0].title,"products");
});
for(const [label,value] of [["server",{data:{status:{code:500,message:"Failed"}}}],["network",()=>Promise.reject(new Error("offline"))]]){
 test(`Banner ${label} load error blocks Add`,async()=>{
  const h=mount(file,{getBanner:value},{page:"contact"});h.render();const t=await h.ready();
  assert.equal(find(t,n=>n.type==="button"&&text(n)==="Add").props.disabled,true);
  assert.ok(find(t,n=>n.props?.role==="alert"));
 });
}
test("Missing banner permits creation using current page",async()=>{
 const h=mount(file,{getBanner:{data:{status:{code:404}}},addOrUpdateBanner:record},{page:"services"});h.render();let t=await h.ready();
 const add=find(t,n=>n.type==="button"&&text(n)==="Add");assert.equal(add.props.disabled,false);add.props.onClick();t=h.render();
 find(t,n=>n.props?.name==="file").props.onChange({target:{files:["file"]}});t=h.render();await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 const sent=h.calls.find(c=>c.method==="addOrUpdateBanner");assert.equal(sent.args[0].title,"services");assert.equal(sent.args[2],null);
});
