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

const file="src/app/components/admin/section/carousel/index.jsx";
const slide={id:3,title:"Slide",imageLink:"image"};
const list={data:{status:{code:200},response:[slide]}};
const deleteButton=tree=>find(tree,n=>n.type==="button"&&text(n)==="Delete");

test("Carousel wrapper uses authenticated DELETE and actual ID",async()=>{
 const calls=[];
 const source=readFileSync(new URL("src/app/services/CarouselService.jsx",root),"utf8");
 const {code}=babel.transformSync(source,{filename:"CarouselService.jsx",presets:[[require.resolve("next/babel"),{"preset-env":{modules:"commonjs"}}]],babelrc:false,configFile:false});
 const module={exports:{}};
 const loader=name=>name==="@/app/axios/http-common"?{__esModule:true,default:()=>({delete:(...args)=>{calls.push(args);return Promise.resolve("ok");}})}:name==="js-cookie"?{__esModule:true,default:{get:()=>"test-token"}}:require(name.replace("@babel/runtime/", "next/dist/compiled/@babel/runtime/"));
 vm.runInNewContext(code,{module,exports:module.exports,require:loader});
 assert.equal(await module.exports.default.deleteCarousel(3),"ok");
 assert.equal(calls[0][0],"admin/delete/carousel/3");
 assert.equal(calls[0][1].headers.Authorization,"Bearer test-token");
});
test("Cancelled deletion makes no request",async()=>{
 const h=mount(file,{getCarouselData:list},{},"az",null,false);h.render();let tree=await h.ready();
 await deleteButton(tree).props.onClick();assert.equal(h.calls.filter(c=>c.method==="deleteCarousel").length,0);
});
test("Successful deletion removes the matching card",async()=>{
 const h=mount(file,{getCarouselData:list,deleteCarousel:{data:{status:{code:200}}}});h.render();let tree=await h.ready();
 await deleteButton(tree).props.onClick();tree=h.render();
 assert.equal(h.calls.find(c=>c.method==="deleteCarousel").args[0],3);
 assert.equal(nodes(tree).filter(n=>n.type==="button"&&text(n)==="Delete").length,0);
});
for (const [label,result] of [["business error",{data:{status:{code:500,message:"Cannot delete"}}}],["network error",()=>Promise.reject(new Error("offline"))]]) {
 test(`Deletion ${label} keeps card and displays error`,async()=>{
  const h=mount(file,{getCarouselData:list,deleteCarousel:result});h.render();let tree=await h.ready();
  await deleteButton(tree).props.onClick();tree=h.render();
  assert.ok(deleteButton(tree));assert.ok(text(find(tree,n=>n.props?.role==="alert")));
  assert.equal(deleteButton(tree).props.disabled,false);
 });
}
test("Pending deletion disables repeated requests",async()=>{
 let finish;const pending=new Promise(resolve=>{finish=resolve;});
 const h=mount(file,{getCarouselData:list,deleteCarousel:()=>pending});h.render();let tree=await h.ready();
 const task=deleteButton(tree).props.onClick();tree=h.render();
 const button=find(tree,n=>n.type==="button"&&text(n)==="Silinir…");assert.equal(button.props.disabled,true);
 await button.props.onClick();assert.equal(h.calls.filter(c=>c.method==="deleteCarousel").length,1);
 finish({data:{status:{code:200}}});await task;
});


test("Add with active IDs 1,3,4 sends create ID zero", async () => {
 const h=mount(file,{getCarouselData:{data:{status:{code:200},response:[1,3,4].map(id=>({...slide,id}))}}});
 h.render();let tree=await h.ready();find(tree,n=>n.type==="button"&&text(n)==="Add").props.onClick();tree=h.render();
 await find(tree,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 assert.equal(h.calls.find(c=>c.method==="addOrUpdateCarousel").args[2],0);
});
test("Save failure keeps editor open and shows backend message",async()=>{
 const h=mount(file,{getCarouselData:list,addOrUpdateCarousel:{data:{status:{code:400,message:"Capacity reached"}}}});
 h.render();let tree=await h.ready();find(tree,n=>n.type==="button"&&text(n)==="Edit").props.onClick();tree=h.render();
 await find(tree,n=>n.type==="form").props.onSubmit({preventDefault(){}});tree=h.render();
 assert.ok(find(tree,n=>n.type==="form"));assert.equal(text(find(tree,n=>n.props?.role==="alert")),"Capacity reached");
 assert.equal(h.calls.filter(c=>c.method==="getCarouselData").length,1);
});
test("Legacy excess slides remain visible for cleanup",async()=>{
 const h=mount(file,{getCarouselData:{data:{status:{code:200},response:[1,3,4,9,17].map(id=>({...slide,id}))}}});
 h.render();const tree=await h.ready();assert.equal(nodes(tree).filter(n=>n.type==="button"&&text(n)==="Delete").length,5);
});
