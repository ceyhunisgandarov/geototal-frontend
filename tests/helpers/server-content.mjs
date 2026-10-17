import {readFileSync} from 'node:fs';
import vm from 'node:vm';
export function contentLoader(fetch) {
 const source=readFileSync(new URL('../../src/lib/server-content.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replaceAll('export const','const');
 const context={fetch,process:{env:{NEXT_PUBLIC_API_BASE_URL:'http://api.test/geototal/'}},AbortSignal,cache:fn=>fn,notFound(){const e=new Error('NOT_FOUND');e.status=404;throw e;}};
 vm.createContext(context);vm.runInContext(source+'\nthis.exports={getDetail,getList,getAbout};',context);return context.exports;
}
