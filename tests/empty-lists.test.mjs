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
for(const c of [{name:"products",get:"getProducts",del:"deleteProduct",button:"Delete Product",item:{id:7,brand:"Last",model:"Model",images:["image"]}},{name:"certificate",get:"getCertificateList",del:"deleteCertificate",button:"Delete",item:{id:7,title:"Last",imageUrl:"image"}}]){
 async function setup(result,rows=[c.item],confirm=true){const h=mount(`src/app/components/admin/section/${c.name}/index.jsx`,{[c.get]:ok(rows),[c.del]:result},{},"az",null,confirm);h.render();await h.ready();return h;}
 test(`${c.name}: deleting last record immediately empties list`,async()=>{const h=await setup(ok("deleted"));await find(h.render(),n=>n.type==="button"&&text(n)===c.button).props.onClick();const t=h.render();assert.equal(nodes(t).some(n=>n.type==="button"&&text(n)===c.button),false);assert.ok(text(t).includes("Hələ qeyd yoxdur."));});
 test(`${c.name}: initial empty list displays empty state`,async()=>{const h=await setup(ok("deleted"),[]);assert.ok(text(h.render()).includes("Hələ qeyd yoxdur."));});
 for(const kind of ["business","network"]){test(`${c.name}: ${kind} failure keeps card and shows red reason`,async()=>{const h=await setup(()=>kind==="business"?{data:{status:{code:400,message:"Cannot delete"}}}:Promise.reject(new Error("offline")));await find(h.render(),n=>n.type==="button"&&text(n)===c.button).props.onClick();const t=h.render();assert.ok(find(t,n=>n.type==="button"&&text(n)===c.button));assert.equal(find(t,n=>n.props?.role==="alert").props.style.color,"#b91c1c");});}
 test(`${c.name}: pending and cancelled deletion do not send extra requests`,async()=>{let done;const pending=new Promise(r=>done=r);const h=await setup(()=>pending);const p=find(h.render(),n=>n.type==="button"&&text(n)===c.button).props.onClick();const button=find(h.render(),n=>n.type==="button"&&text(n)===c.button);assert.equal(button.props.disabled,true);await button.props.onClick();assert.equal(h.calls.filter(x=>x.method===c.del).length,1);done(ok("deleted"));await p;const cancelled=await setup(ok("deleted"),[c.item],false);await find(cancelled.render(),n=>n.type==="button"&&text(n)===c.button).props.onClick();assert.equal(cancelled.calls.filter(x=>x.method===c.del).length,0);});
}
