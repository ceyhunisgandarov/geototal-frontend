import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import vm from "node:vm";
import {localizedText, localizedProjectName} from "../src/lib/localizedText.js";
import {resolveLocale, switchLocalePath} from "../src/lib/locales.js";
const require = createRequire(import.meta.url);
const babel = require("next/dist/compiled/babel/core");
const root = new URL("../", import.meta.url);
const families = [["title", "title"], ["secondTitle", "secondTitle"], ["description", "description"],
 ["description", "descriptionAz"], ["serviceName", "serviceName"], ["serviceText", "serviceTextAz"],
 ["worksDescription", "worksDescription"], ["feedBack", "feedBack"], ["referenceName", "referenceName"], ["slogan", "slogan"]];
for (const [field, az] of families) {
 for (const locale of ["az", "en", "ru", "ky"]) test(`${field}/${az} selects ${locale}`, () => {
  const values = {[az]:"AZ", [`${field}En`]:"EN", [`${field}Ru`]:"RU", [`${field}Ky`]:"KY"};
  assert.equal(localizedText(values, field, locale, az), locale.toUpperCase());
 });
 test(`${field}/${az} KY fallback never consumes RU`, () => {
  const values = {[az]:"AZ", [`${field}En`]:"EN", [`${field}Ru`]:"RU", [`${field}Ky`]:"  "};
  assert.equal(localizedText(values,field,"ky",az),"AZ");values[az]=null;
  assert.equal(localizedText(values,field,"ky",az),"EN");delete values[`${field}En`];
  assert.equal(localizedText(values,field,"ky",az),"");
 });
}
test("locale resolution never inherits another request", () => {
 assert.equal(resolveLocale("ky"),"ky");assert.equal(resolveLocale(undefined),"az");
 assert.equal(resolveLocale("ru"),"ru");assert.equal(resolveLocale(undefined),"az");
 assert.equal(resolveLocale("invalid"),"az");
});
for (const locale of ["az","en","ru","ky"]) test(`locale path preserves admin and detail routes: ${locale}`, () => {
 for(const path of ["/ky/fake-entry/admin","/ky/products/7","/ky/projects/example","/ky/services/example"])
  assert.equal(switchLocalePath(path,locale),path.replace(/^\/ky/,`/${locale}`));
});

// Exercise real JSX form handlers and submitted objects with in-memory API doubles.
// No application server, cookies, external API or real credentials are used.
function mount(file, services, props={}, locale="ky") {
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
  if(name==="@/lib/localizedText")return {localizedText, localizedProjectName};
  if(name.includes("/services/"))return {__esModule:true,default:new Proxy({}, {get(_,method){return (...args)=>{calls.push({method,args});const value=services[method];return Promise.resolve(typeof value==="function"?value(...args):value??{data:{status:{code:200}}});};}})};
  if(name.endsWith(".css"))return new Proxy({}, {get:(_,key)=>String(key)});
  if(name==="next/image"||name==="next/link"||name.startsWith("../"))return name;
  if(name.startsWith("@babel/runtime/"))return require(name.replace("@babel/runtime/", "next/dist/compiled/@babel/runtime/"));
  return require(name);
 };
 const source=readFileSync(new URL(file,root),"utf8");
 const {code}=babel.transformSync(source,{filename:new URL(file,root).pathname,presets:[["next/babel",{"preset-env":{modules:"commonjs"}}]],babelrc:false,configFile:false});
 const module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:loader,console:{log(){},warn(){},error(){}},alert(){},confirm:()=>false,setTimeout:fn=>fn(),clearTimeout(){},window:{innerWidth:1200,addEventListener(){},removeEventListener(){}},URL,Blob});
 const render=()=>{cursor=0;effectCursor=0;const tree=module.exports.default(props);first=false;return tree;};
 const ready=async()=>{let tree;for(let i=0;i<6&&effects.length;i++){const pending=effects;effects=[];for(const effect of pending)effect();await new Promise(r=>setImmediate(r));tree=render();}return tree??render();};
 return {render,ready,calls};
}
function nodes(tree){if(tree==null||typeof tree!=="object")return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)];}
function find(tree,predicate){const n=nodes(tree).find(predicate);assert.ok(n,"Expected form control not found");return n;}
const text=n=>nodes(n).flatMap(x=>x.props?.children??[]).filter(x=>typeof x==="string").join("");
const fixture={id:7,brand:"Brand",model:"Model",category:"TOTAL_STATION",images:["fake-image"],bestseller:false,stock:1,
 descriptionAz:"AZ",descriptionEn:"EN",descriptionRu:"RU",descriptionKy:"KY",title:"AZ",titleEn:"EN",titleRu:"RU",titleKy:"KY",secondTitle:"AZ",secondTitleEn:"EN",secondTitleRu:"RU",secondTitleKy:"KY",description:"AZ",slogan:"AZ",sloganEn:"EN",sloganRu:"RU",sloganKy:"KY",approximatelyProjectsCount:1,approximatelyStaffsCount:1};
const response=value=>({data:{status:{code:200},response:value}});
test("Product edit keeps RU and KY independent and submits existing KY",async()=>{
 const h=mount("src/app/components/admin/section/products/index.jsx",{getProducts:response([fixture])});h.render();let t=await h.ready();
 find(t,n=>n.type==="button"&&text(n)==="Edit Product").props.onClick();t=h.render();
 assert.equal(find(t,n=>n.props?.placeholder==="Description (Ky)").props.value,"KY");
 find(t,n=>n.props?.placeholder==="Description (Ru)").props.onChange({target:{value:"changed-ru"}});t=h.render();
 assert.equal(find(t,n=>n.props?.placeholder==="Description (Ky)").props.value,"KY");
 find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});
 let submitted=h.calls.find(c=>c.method==="addOrUpdateProduct");assert.equal(submitted.args[0].descriptionKy,"KY");assert.equal(submitted.args[0].descriptionRu,"changed-ru");assert.equal(submitted.args[0].category,"TS");assert.equal(submitted.args[3].length,0);
 find(t,n=>n.props?.placeholder==="Description (Ky)").props.onChange({target:{value:"new-ky"}});t=h.render();find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(h.calls.filter(c=>c.method==="addOrUpdateProduct").at(-1).args[0].descriptionKy,"new-ky");
});
test("Product create sends KY",()=>{
 const h=mount("src/app/components/admin/section/products/index.jsx",{});let t=h.render();find(t,n=>n.type==="button"&&text(n)==="Add new product").props.onClick();t=h.render();find(t,n=>n.props?.placeholder==="Description (Ky)").props.onChange({target:{value:"new-ky"}});t=h.render();find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(h.calls.find(c=>c.method==="addOrUpdateProduct").args[0].descriptionKy,"new-ky");
});
test("Service edit carries part IDs and KY without RU overwrites",async()=>{
 const service={id:1,serviceName:"AZ",serviceNameEn:"EN",serviceNameRu:"RU",serviceNameKy:"KY",pathName:"service",serviceParts:[{id:2,partName:"part",serviceTextAz:"AZ",serviceTextEn:"EN",serviceTextRu:"RU",serviceTextKy:"part-KY"}]};
 const h=mount("src/app/components/admin/section/service/index.jsx",{getServices:response([service])});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)==="Update").props.onClick();t=h.render();
 find(t,n=>n.props?.placeholder==="Service Name RU").props.onChange({target:{value:"new-ru"}});t=h.render();assert.equal(find(t,n=>n.props?.placeholder==="Service Name KY").props.value,"KY");
 // Submit the modal button, keeping the edited state.
 t=h.render();const buttons=nodes(t).filter(n=>n.type==="button"&&text(n)==="Update");await buttons.at(-1).props.onClick();
 const sent=h.calls.find(c=>c.method==="addOrUpdateService");assert.equal(sent.args[0].serviceNameKy,"KY");assert.equal(sent.args[2][0].serviceTextKy,"part-KY");assert.equal(sent.args[2][0].id,2);
});
test("About edit hydrates all translations before submitting",async()=>{
 const h=mount("src/app/components/admin/section/aboutus/index.jsx",{getAboutInfo:response(fixture)});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)==="Change or Add").props.onClick();t=h.render();
 for(const name of ["titleKy","secondTitleKy","descriptionKy"])assert.equal(find(t,n=>n.props?.name===name).props.value,"KY");
 find(t,n=>n.type==="button"&&text(n)==="Kaydet").props.onClick();const sent=h.calls.find(c=>c.method==="addOrUpdateAboutInfo");assert.equal(sent.args[0].title,"AZ");assert.equal(sent.args[0].descriptionKy,"KY");
});
test("Carousel edit preserves all slogans and actual record ID",async()=>{
 const h=mount("src/app/components/admin/section/carousel/index.jsx",{getCarouselData:response([fixture])});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)==="Edit").props.onClick();t=h.render();find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});const sent=h.calls.find(c=>c.method==="addOrUpdateCarousel");for(const suffix of ["","En","Ru","Ky"])assert.equal(sent.args[0][`slogan${suffix}`],fixture[`slogan${suffix}`]);assert.equal(sent.args[0].descriptionKy,"KY");assert.equal(sent.args[2],7);
});
test("Project edit submits the supported worksDescriptionKy",async()=>{
 const h=mount("src/app/components/admin/section/projects/form/index.jsx",{getProject:response({...fixture,worksDescriptionKy:"KY"})},{path:"project"});h.render();let t=await h.ready();assert.equal(find(t,n=>n.props?.name==="worksDescriptionKy").props.value,"KY");await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});assert.equal(h.calls.find(c=>c.method==="addOrUpdateProject").args[0].worksDescriptionKy,"KY");
});
test("Blog edit hydrates and submits four languages",async()=>{
 const h=mount("src/app/components/admin/section/blog/index.jsx",{getBlogs:response([fixture])});h.render();let t=await h.ready();find(t,n=>n.type==="button"&&text(n)==="Edit Blog").props.onClick();t=h.render();assert.equal(find(t,n=>n.props?.name==="descriptionKy").props.value,"KY");await find(t,n=>n.type==="form").props.onSubmit({preventDefault(){}});const sent=h.calls.find(c=>c.method==="saveBlog");assert.equal(sent.args[0].descriptionKy,"KY");assert.equal(sent.args[0].descriptionRu,"RU");
});

for(const locale of ["az","en","ru","ky"]) {
 test(`Product detail renders ${locale}`,async()=>{
  const h=mount("src/app/components/productcomponent/index.jsx",{getProduct:response(fixture)},{id:7},locale);h.render();const tree=await h.ready();
  assert.ok(nodes(tree).some(n=>n.type==="p"&&text(n)===locale.toUpperCase()));
 });
 test(`Service detail renders ${locale}`,async()=>{
  const record={serviceName:"AZ",serviceNameEn:"EN",serviceNameRu:"RU",serviceNameKy:"KY",serviceParts:[{id:1,partName:"part",serviceTextAz:"AZ",serviceTextEn:"EN",serviceTextRu:"RU",serviceTextKy:"KY"}]};
  const h=mount("src/app/components/section/servicepage/index.jsx",{getService:response(record)},{service:"example"},locale);h.render();const tree=await h.ready();assert.ok(nodes(tree).some(n=>n.type==="h2"&&text(n)===locale.toUpperCase()));assert.ok(nodes(tree).some(n=>n.type==="p"&&text(n)===locale.toUpperCase()));
 });
 test(`Project detail renders ${locale}`,async()=>{
  const record={projectName:"Project",worksDescription:"AZ",worksDescriptionEn:"EN",worksDescriptionRu:"RU",worksDescriptionKy:"KY",feedBack:"AZ",feedBackEn:"EN",feedBackRu:"RU",feedBackKy:"KY"};
  const h=mount("src/app/components/section/project/index.jsx",{getProject:response(record)},{project:"example"},locale);h.render();const tree=await h.ready();assert.ok(nodes(tree).some(n=>n.props?.dangerouslySetInnerHTML?.__html===locale.toUpperCase()));assert.ok(nodes(tree).some(n=>n.type==="p"&&text(n)===locale.toUpperCase()));
 });
 for(const component of ["aboutuscontent","secondaboutcontent"])test(`${component} renders ${locale}`,async()=>{
  const h=mount(`src/app/components/${component}/index.jsx`,{getAboutInfo:response(fixture)},{},locale);h.render();const tree=await h.ready();assert.ok(nodes(tree).some(n=>text(n)===locale.toUpperCase()||n.props?.dangerouslySetInnerHTML?.__html===locale.toUpperCase()));
 });
 test(`Carousel renders ${locale}`,async()=>{
  const h=mount("src/app/components/moderncarousel/index.jsx",{getCarouselData:response([fixture])},{},locale);h.render();const tree=await h.ready();assert.ok(nodes(tree).some(n=>n.type==="h3"&&text(n)===locale.toUpperCase()));assert.ok(nodes(tree).some(n=>n.type==="h1"&&text(n)===locale.toUpperCase()));
 });
 test(`Service list alt text renders ${locale}`,async()=>{
  const record={id:1,serviceName:"AZ",serviceNameEn:"EN",serviceNameRu:"RU",serviceNameKy:"KY",serviceImageUrl:"image"};
  const h=mount("src/app/components/modernservice/index.jsx",{getServices:response([record])},{},locale);h.render();const tree=await h.ready();assert.ok(nodes(tree).some(n=>n.props?.alt===locale.toUpperCase()));
 });
 test(`Product list links use ${locale}`,async()=>{
  const h=mount("src/app/components/section/productlist/index.jsx",{getProducts:response([fixture])},{},locale);h.render();const tree=await h.ready();assert.ok(nodes(tree).some(n=>n.props?.href===`/${locale}/products/7`));
 });
}

test("Customer project titles are Kyrgyz-only and preserve unknown names", () => {
 const p={path:"hadrut-restoration",projectName:"Original title"};
 assert.equal(localizedProjectName(p,"ky"),"Карабах аймагы, Ходжавенд району, Хадрут шаарчасын калыбына келтирүү");
 for(const lang of ["az","en","ru"]) assert.equal(localizedProjectName(p,lang),"Original title");
 assert.equal(localizedProjectName({path:"unknown",projectName:"Name"},"ky"),"Name");
 assert.equal(localizedProjectName({...p,projectNameKy:"Future CMS title"},"ky"),"Future CMS title");
});


test("Statistics uses active KY context even when a stale AZ prop is passed", () => {
 const h=mount("src/app/components/stats/StatsSection.jsx",{}, {locale:"az"}, "ky");
 const tree=h.render();
 assert.ok(nodes(tree).some(n=>text(n)==="Биздин тажрыйба сандарда"));
 assert.ok(nodes(tree).some(n=>text(n)==="жылдык тажрыйба"));
});
