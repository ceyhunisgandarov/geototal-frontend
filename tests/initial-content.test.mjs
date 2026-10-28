import {contentLabels,partHeading} from "../src/lib/content-labels.js";
import {localizedText, localizedProjectName} from "../src/lib/localizedText.js";
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
  if(name==="@/lib/localizedText")return {localizedText, localizedProjectName};
  if(name==="react")return react;
  if(name==="next-intl")return {useLocale:()=>locale,useTranslations:()=>key=>key==="locale"?(file==="src/app/components/homebody/index.jsx"?"MISSING_LOCALE_KEY":locale):key};
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

test("Server-provided service details render text before effects and skip browser refetch",async()=>{
 const row={serviceName:"Surveying",serviceParts:[{id:1,partName:"Measurements",serviceTextAz:"Visible service content"}]};const h=mount("src/app/components/section/servicepage/index.jsx",{},{service:"surveying",initialData:row},"az");const tree=h.render();assert.ok(text(tree).includes("Visible service content"));await h.ready();assert.equal(h.calls.length,0);
});
test("Server-provided products render on the first pass and category selection still filters",async()=>{
 const rows=[{id:1,brand:"Leica",model:"TS",category:"TOTAL_STATION"},{id:2,brand:"Other",model:"GPS",category:"GNSS"}];const h=mount("src/app/components/section/productlist/index.jsx",{},{initialData:rows,selectedCategory:"GNSS"});assert.ok(text(h.render()).includes("GPS"));assert.ok(!text(h.render()).includes("Leica"));await h.ready();assert.equal(h.calls.length,0);
});
test("Server-provided projects render initial links without browser fetch",async()=>{
 const h=mount("src/app/components/projectscomponent/index.jsx",{},{initialData:[{id:7,projectName:"Bridge",path:"bridge"}]},"az");const t=h.render();assert.ok(text(t).includes("Bridge"));assert.ok(find(t,n=>n.props?.href==="/az/projects/bridge"));await h.ready();assert.equal(h.calls.length,0);
});

for (const locale of ["az", "en", "ru", "ky"]) test(`Homepage product cards use routing locale ${locale}`, () => {
 const h=mount("src/app/components/homebody/index.jsx",{}, {initialData:[{id:7,brand:"Geo",model:"Survey",bestseller:true}]},locale);
 const cards=nodes(h.render()).filter(n=>n.type==="../elements/card");
 assert.equal(cards.length,2);
 assert.ok(cards.every(n=>n.props.locale===locale));
});

test('Project body H1 headings become H2 while the page keeps one H1',()=>{
 const h=mount('src/app/components/section/project/index.jsx',{}, {initialData:{projectName:'Project',worksDescription:'<H1 class="intro">Overview</H1><p>Content</p><h2>Results</h2>',imageUrl:'/image.png'}},'az');
 const tree=h.render();assert.equal(nodes(tree).filter(n=>n.type==='h1').length,1);
 const html=find(tree,n=>n.props?.dangerouslySetInnerHTML).props.dangerouslySetInnerHTML.__html;
 assert.equal(html,'<h2 class="intro">Overview</h2><p>Content</p><h2>Results</h2>');
});
test('Product cards identify the device and catalog decoration has empty alt',()=>{
 const file='src/app/components/elements/card/index.jsx';const product={id:7,brand:'Geomax',model:'Zoom50',images:['/device.png']};
 const tree=mount(file,{}, {product,locale:'az'}).render();assert.equal(find(tree,n=>n.type==='next/image').props.alt,'Geomax Zoom50');
 const more=mount(file,{}, {product,locale:'az',more:true}).render();assert.equal(find(more,n=>n.type==='next/image').props.alt,'');
});
