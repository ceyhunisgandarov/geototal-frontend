import {carouselHref} from "../src/lib/carouselLink.js";
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




test("Carousel links use current locale, preserve external URLs and hide empty or unsafe values",()=>{
 for(const value of ["services/test","/services/test","/az/services/test"])assert.equal(carouselHref(value,"ky"),"/ky/services/test");
 assert.equal(carouselHref("https://example.com/page?q=1","az"),"https://example.com/page?q=1");
 for(const value of [null,"","  ","javascript:alert(1)","//example.com","https://","data:text/html,test"])assert.equal(carouselHref(value,"az"),null);
});
test("Carousel edit hydrates, preserves and clears link in save payload",async()=>{
 const item={id:7,title:"Slide",link:"services/original"};const ok=response=>({data:{status:{code:200},response}});
 const h=mount("src/app/components/admin/section/carousel/index.jsx",{getCarouselData:ok([item]),addOrUpdateCarousel:{data:{status:{code:400,message:"Keep editing"}}}});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)==="Edit").props.onClick();t=h.render();assert.equal(find(t,n=>n.props?.name==="link").props.value,item.link);
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(h.calls.find(c=>c.method==="addOrUpdateCarousel").args[0].link,item.link);
 t=h.render();find(t,n=>n.props?.name==="link").props.onChange({target:{name:"link",value:""}});t=h.render();await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(h.calls.filter(c=>c.method==="addOrUpdateCarousel").at(-1).args[0].link,"");
});
