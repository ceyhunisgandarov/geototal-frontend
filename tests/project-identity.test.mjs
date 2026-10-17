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


const file="src/app/components/admin/section/projects/form/index.jsx";
const project={id:7,path:"old",projectName:"Name",customer:"Customer",worksDescriptionKy:"ky"};
const response=p=>({data:{status:{code:200},response:p}});
test("Project rename sends stable ID and keeps saved ID for second save",async()=>{
 const h=mount(file,{getProject:response(project),addOrUpdateProject:response({...project,path:"changed"})},{path:"old"});h.render();let t=await h.ready();
 find(t,n=>n.props?.name==="path").props.onChange({target:{name:"path",value:"changed"}});t=h.render();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});t=h.render();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 assert.deepEqual(h.calls.filter(c=>c.method==="addOrUpdateProject").map(c=>c.args[2]),[7,7]);
});
test("Create switches to returned ID and clears uploads",async()=>{
 const h=mount(file,{addOrUpdateProject:response({...project,path:"new-project"})},{path:"new"});let t=h.render();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});t=h.render();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 const calls=h.calls.filter(c=>c.method==="addOrUpdateProject");assert.equal(calls[0].args[2],0);assert.equal(calls[1].args[2],7);assert.equal(calls[1].args[1],null);assert.equal(calls[1].args[3],null);
});
test("Load failure cannot accidentally create a project",async()=>{
 const h=mount(file,{getProject:{data:{status:{code:404}}}},{path:"old"});h.render();const t=await h.ready();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 assert.equal(h.calls.filter(c=>c.method==="addOrUpdateProject").length,0);assert.ok(find(t,n=>n.props?.role==="alert"));
});
test("Save error preserves editor and successful save notifies parent",async()=>{
 let done=0;const h=mount(file,{getProject:response(project),addOrUpdateProject:{data:{status:{code:403,message:"Duplicate path"}}}},{path:"old",onSaved:()=>done++});h.render();let t=await h.ready();
 await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});t=h.render();assert.equal(done,0);assert.equal(text(find(t,n=>n.props?.role==="alert")),"Duplicate path");
 const ok=mount(file,{getProject:response(project),addOrUpdateProject:response(project)},{path:"old",onSaved:()=>done++});ok.render();t=await ok.ready();await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(done,1);
});

test("Project multipart includes all KY translations",async()=>{
 const source=readFileSync(new URL("src/app/services/ProjectService.jsx",root),"utf8").replace(/^import .*;\r?\n/gm,"").replace("export default","module.exports =");
 const module={exports:{}};let sent;
 vm.runInNewContext(source,{module,FormData,Cookies:{get:()=>"token"},createAxiosInstance:()=>({put:(url,data)=>{sent=JSON.parse(data.get("reqProject"));return Promise.resolve();}})});
 await module.exports.addOrUpdateProject({id:7,projectNameKy:"Долбоор",referenceNameKy:"Кардар",feedBackKy:"Пикир"},null,7,null);
 assert.equal(sent.projectNameKy,"Долбоор");assert.equal(sent.referenceNameKy,"Кардар");assert.equal(sent.feedBackKy,"Пикир");assert.equal(sent.id,undefined);
});
