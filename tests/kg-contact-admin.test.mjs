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
  useEffect(fn,deps){const i=effectCursor++;if(!deps||!effectDeps[i]||deps.some((value,index)=>value!==effectDeps[i][index]))effects.push(fn);effectDeps[i]=deps;},createContext(){return {Provider:"Provider"};},useRef(){return {current:null};}
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
 vm.runInNewContext(code,{module,exports:module.exports,require:loader,console:{log(){},warn(){},error(){}},alert(){},confirm:()=>confirmDelete,setTimeout:fn=>fn(),clearTimeout(){},window:{innerWidth:1200,addEventListener(){},removeEventListener(){},dispatchEvent(){}},URL,Blob,Event});
 const render=()=>{cursor=0;effectCursor=0;const tree=(module.exports.default || module.exports.DomainContactProvider)(props);first=false;return tree;};
 const ready=async()=>{let tree;for(let i=0;i<6&&effects.length;i++){const pending=effects;effects=[];for(const effect of pending)effect();await new Promise(r=>setImmediate(r));tree=render();}return tree??render();};
 return {render,ready,calls};
}
function nodes(tree){if(tree==null||typeof tree!=="object")return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)];}
function find(tree,predicate){const n=nodes(tree).find(predicate);assert.ok(n,"Expected form control not found");return n;}
const text=n=>nodes(n).flatMap(x=>x.props?.children??[]).filter(x=>typeof x==="string").join("");





const ok=response=>({data:{status:{code:200},response}});
const file="src/app/components/admin/section/branchcontact/index.jsx";
const row={branch:"kg",companyName:"KG",address:"Bishkek",addressKy:"Кыргызча",phoneNumbers:["+996 703 448 444"],emailAddress:["info@geototal.kg"],whatsappNumber:"+996 703 448 444"};
test("KG form loads translations and saves independently",async()=>{
 const h=mount(file,{getContact:ok(row),saveContact:ok(row)});h.render();let t=await h.ready();assert.equal(find(t,n=>n.props?.name==="addressKy").props.value,"Кыргызча");find(t,n=>n.props?.name==="addressKy").props.onChange({target:{name:"addressKy",value:"Жаңы"}});await find(h.render(),n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(h.calls.find(c=>c.method==="saveContact").args[0].addressKy,"Жаңы");assert.ok(find(h.render(),n=>n.props?.role==="status"));
});
test("KG save error preserves edits and displays red reason beside save",async()=>{
 const h=mount(file,{getContact:ok(row),saveContact:{data:{status:{code:400,message:"Email düzgün deyil."}}}});h.render();await h.ready();find(h.render(),n=>n.props?.name==="address").props.onChange({target:{name:"address",value:"New address"}});await find(h.render(),n=>n.type==="form").props.onSubmit({preventDefault(){}});const t=h.render();assert.equal(find(t,n=>n.props?.name==="address").props.value,"New address");assert.equal(find(t,n=>n.props?.role==="alert").props.style.color,"#b91c1c");assert.ok(text(t).includes("Email düzgün deyil."));
});
test("KG wrapper strips derived URL and uses protected branch endpoint",()=>{
 const calls=[];const source=readFileSync(new URL("src/app/services/BranchContactService.jsx",root),"utf8").replace(/^import .*;\r?\n/gm,"").replace("export default","module.exports =");const module={exports:{}};vm.runInNewContext(source,{module,Cookies:{get:()=>"token"},createAxiosInstance:()=>({put:(...args)=>calls.push(args)})});module.exports.saveContact({...row,whatsappUrl:"derived"});assert.equal(calls[0][0],"admin/contact/branch/kg");assert.equal(calls[0][1].whatsappUrl,undefined);assert.equal(calls[0][2].headers.Authorization,"Bearer token");
});

for(const kg of [true,false])test(`Domain provider ${kg?"loads KG from API":"leaves AZ separate"}`,async()=>{
 const h=mount("src/i18n/domain-contact.jsx",{getContact:ok(row)},{contact:kg?{address:"fallback"}:null,children:"child"});h.render();const t=await h.ready();assert.equal(h.calls.filter(c=>c.method==="getContact").length,kg?1:0);assert.equal(t.props.value?.address??null,kg?"Кыргызча":null);
});
