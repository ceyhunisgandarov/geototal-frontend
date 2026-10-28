import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import axios from 'axios';
import {insertBlogImage,blogSaveError} from '../src/lib/blog-editor.js';
const source=readFileSync(new URL('../src/app/services/BlogService.jsx',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export default','return');
const fixtures=new URL('../content/prepared/2026-10-28/blogs/geodeziya-topoqrafiya-suni-intellekt.json',import.meta.url);
test('Real Axios transform preserves multipart JSON, Unicode text and inline image positions',async()=>{
 const captured=[];const client=axios.create({headers:{'Content-Type':'application/json'},adapter:async config=>{captured.push(config);return {status:200,statusText:'OK',data:{status:{code:200}},headers:{},config};}});
 const service=new Function('createAxiosInstance','Cookies','FormData',source)(()=>client,{get:()=> 'test-token'},FormData);
 const prepared=JSON.parse(readFileSync(fixtures));
 await service.saveBlog(prepared.request,new Blob(['image'],{type:'image/png'}),0);
 const config=captured[0];assert.ok(config.data instanceof FormData);assert.equal(config.headers.get('Authorization'),'Bearer test-token');
 assert.match(config.headers.get('Content-Type'),/multipart\/form-data/);
 assert.deepEqual(JSON.parse(config.data.get('reqBlog')),prepared.request);assert.ok(config.data.get('certificateImage'));
 await service.uploadInlineImage(new Blob(['image'],{type:'image/png'}));assert.equal(captured[1].url,'admin/blog/image');assert.ok(captured[1].data.get('image'));
});
test('Inline image is inserted at selection without dropping surrounding paragraphs',()=>{
 assert.equal(insertBlogImage('Before SELECT After',7,13,'https://images.example/a(b).png','İş şəkli'),'Before \n\n![İş şəkli](https://images.example/a%28b%29.png)\n\n*İş şəkli*\n\n After');
 assert.throws(()=>insertBlogImage('',0,0,'javascript:alert(1)','image'));
 assert.throws(()=>insertBlogImage('',0,0,'https://images.example/a.png',' '));
});
test('Save errors explain server rejection, expired login and oversized files',()=>{
 assert.equal(blogSaveError({response:{data:{status:{message:'Missing translation'}}}}),'Missing translation');
 assert.match(blogSaveError({response:{status:413}}),/böyük/);assert.match(blogSaveError({response:{status:401}}),/daxil/);
});
