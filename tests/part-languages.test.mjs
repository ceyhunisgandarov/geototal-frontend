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
const part={id:2,partName:"AZ",partNameEn:"EN",partNameRu:"RU",partNameKy:"KY",serviceTextAz:"az",serviceTextEn:"en",serviceTextRu:"ru",serviceImageUrl:"image"};
const service={id:1,serviceName:"AZ",serviceNameEn:"EN",serviceNameRu:"RU",pathName:"service",serviceParts:[part]};
test("Part title translations hydrate, submit and Cancel restores them",async()=>{
 const h=mount("src/app/components/admin/section/service/index.jsx",{getServices:ok([service]),addOrUpdateService:{data:{status:{code:400,message:"retry"}}}});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)==="Update").props.onClick();t=h.render();
 for(const l of ["En","Ru","Ky"]){const f=find(t,n=>n.props?.name==="partName"+l);assert.equal(f.props.value,l.toUpperCase());f.props.onChange({target:{value:"new "+l}});t=h.render();}
 await nodes(t).filter(n=>n.type==="button"&&text(n)==="Update").at(-1).props.onClick();const sent=h.calls.find(c=>c.method==="addOrUpdateService").args[2][0];for(const l of ["En","Ru","Ky"])assert.equal(sent["partName"+l],"new "+l);
 find(h.render(),n=>n.type==="button"&&text(n)==="Cancel").props.onClick();find(h.render(),n=>n.type==="button"&&text(n)==="Update").props.onClick();assert.equal(find(h.render(),n=>n.props?.name==="partNameKy").props.value,"KY");
});
for(const locale of ["az","en","ru","ky"])test(`Service part public title uses ${locale}`,async()=>{const h=mount("src/app/components/section/servicepage/index.jsx",{getService:ok(service)},{service:"service"},locale);h.render();const t=await h.ready();assert.ok(nodes(t).some(n=>n.type==="h2"&&text(n)===locale.toUpperCase()));});
