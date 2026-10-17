import test from 'node:test';
import assert from 'node:assert/strict';
import {contentLoader} from './helpers/server-content.mjs';
const response=(code,record,message='')=>({ok:true,status:200,json:async()=>({status:{code,message},response:record})});
for(const kind of ['service','project','product'])test(`${kind}: missing content produces notFound`,async()=>{
 const api=contentLoader(async()=>response(404,null));await assert.rejects(()=>api.getDetail(kind,'7'),{message:'NOT_FOUND'});
});
test('Legacy missing service is distinguished from authorization failure',async()=>{
 await assert.rejects(()=>contentLoader(async()=>response(403,null,'Service not found')).getDetail('service','missing'),{message:'NOT_FOUND'});
 await assert.rejects(()=>contentLoader(async()=>response(403,null,'Forbidden')).getDetail('service','private'),/temporarily unavailable/);
});
for(const failed of [async()=>{throw Error('timeout')},async()=>({ok:false,status:503}),async()=>response(500,null),async()=>response(200,null),async()=>({ok:true,status:200,json:async()=>{throw Error('json')}})])test('API failure never becomes a false 404',async()=>{
 await assert.rejects(()=>contentLoader(failed).getDetail('service','lidar'),e=>e.status!==404);
});
test('Invalid product IDs are rejected before contacting API',async()=>{
 let calls=0;const api=contentLoader(async()=>{calls++;return response(200,{})});for(const id of ['abc','0','-1','1.5','9223372036854775808'])await assert.rejects(()=>api.getDetail('product',id),{message:'NOT_FOUND'});assert.equal(calls,0);
});
test('Empty lists are valid; project legacy empty response is supported narrowly',async()=>{
 const api=contentLoader(async()=>response(200,[]));assert.equal((await api.getList('services')).length,0);assert.equal((await api.getList('products')).length,0);
 assert.equal((await contentLoader(async()=>response(404,null,'Empty List')).getList('projects')).length,0);
 await assert.rejects(()=>contentLoader(async()=>response(404,null)).getList('projects'),/temporarily unavailable/);
});
test('Record and list fetches disable persistent caching and encode detail keys',async()=>{
 const calls=[];const api=contentLoader(async(url,options)=>{calls.push({url,options});return response(200,{projectName:'Project'})});assert.equal((await api.getDetail('project','a b')).projectName,'Project');assert.equal(calls[0].url,'http://api.test/geototal/user/project/a%20b');assert.equal(calls[0].options.cache,'no-store');assert.ok(calls[0].options.signal);
});
