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
  if(name==="@/i18n/domain-locales")return {useDomainLocales:()=>["az","en","ru","ky"]};
  if(name==="@/lib/locales")return {switchLocalePath:()=>"/ky/local-preview/admin"};
  if(name==="react")return react;
  if(name==="next-intl")return {useLocale:()=>locale,useTranslations:()=>key=>key==="locale"?locale:key};
  if(name==="next/navigation")return {usePathname:()=>"/az/local-preview/admin",useRouter:()=>({push(){},replace(){}})};
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



const file="src/app/components/admin/layout/navbar/index.jsx";
const response=url=>({data:{status:{code:200},response:{url}}});
function open(h,t){find(t,n=>n.props?.onClick?.name==="openLogoModal").props.onClick();t=h.render();find(t,n=>n.props?.type==="file").props.onChange({target:{files:[new Blob(["image"])]}});return h.render();}
test("Admin loads stored logo and refreshes after save",async()=>{
 let count=0;const h=mount(file,{getLogo:()=>response(++count===1?"old":"new"),changeLogo:response("new")});h.render();let t=await h.ready();assert.equal(find(t,n=>n.props?.alt==="logo").props.src,"old");t=open(h,t);await find(t,n=>n.type==="button"&&text(n)==="Save").props.onClick();t=h.render();assert.equal(find(t,n=>n.props?.alt==="logo").props.src,"new");assert.equal(nodes(t).some(n=>n.props?.type==="file"),false);assert.equal(count,2);
});
for(const failure of ["business","network"]){test(`Logo ${failure} failure preserves form and old logo`,async()=>{
 const h=mount(file,{getLogo:response("old"),changeLogo:()=>failure==="network"?Promise.reject(new Error("offline")):{data:{status:{code:400,message:"rejected"}}}});h.render();let t=await h.ready();t=open(h,t);await find(t,n=>n.type==="button"&&text(n)==="Save").props.onClick();t=h.render();assert.ok(find(t,n=>n.props?.type==="file"));assert.ok(find(t,n=>n.props?.role==="alert"));assert.equal(find(t,n=>n.props?.alt==="logo").props.src,"old");
});}
test("Pending save disables controls and reopening clears chosen file",async()=>{
 let done;const pending=new Promise(r=>done=r);const h=mount(file,{getLogo:response("old"),changeLogo:()=>pending});h.render();let t=await h.ready();t=open(h,t);const save=find(t,n=>n.type==="button"&&text(n)==="Save").props.onClick();t=h.render();assert.equal(find(t,n=>n.props?.type==="file").props.disabled,true);assert.equal(find(t,n=>n.type==="button"&&text(n)==="Cancel").props.disabled,true);done(response("new"));await save;t=h.render();find(t,n=>n.props?.onClick?.name==="openLogoModal").props.onClick();t=h.render();assert.equal(find(t,n=>n.type==="button"&&text(n)==="Save").props.disabled,true);
});
