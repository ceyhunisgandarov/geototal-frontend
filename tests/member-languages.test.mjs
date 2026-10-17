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





const record={id:7,fullName:"Name",email:"a@example.com",jobTitle:"AZ",jobTitleEn:"EN",jobTitleRu:"RU",jobTitleKy:"KY",imageUrl:"image"};
const ok=response=>({data:{status:{code:200},response}});
for(const create of [true,false])test(`Member ${create?"create":"edit"} submits language fields and shows save failure`,async()=>{
 const h=mount("src/app/components/admin/section/members/index.jsx",{getMembers:ok([record]),addOrUpdatMember:{data:{status:{code:400,message:"Upload failed"}}}});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)===(create?"ADD NEW MEMBER":"Change")).props.onClick();t=h.render();
 for(const l of ["En","Ru","Ky"]){const name="jobTitle"+l;const f=find(t,n=>n.props?.name===name);assert.equal(f.props.value,create?"":record[name]);f.props.onChange({target:{name,value:"new "+l}});t=h.render();}
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});t=h.render();const sent=h.calls.find(c=>c.method==="addOrUpdatMember");for(const l of ["En","Ru","Ky"])assert.equal(sent.args[0]["jobTitle"+l],"new "+l);assert.equal(find(t,n=>n.props?.role==="alert").props.style.color,"#b91c1c");
});
for(const locale of ["az","en","ru","ky"])test(`Member public title selects ${locale}`,async()=>{const h=mount("src/app/components/members/index.jsx",{getMembers:ok([record])},{},locale);h.render();const t=await h.ready();assert.ok(nodes(t).some(n=>n.type==="h5"&&text(n)===locale.toUpperCase()));});
