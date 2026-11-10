import {publicPath} from './public-routes.js';

// Both domains must publish the same reciprocal language/region cluster.
const variants = [
 ['az-AZ','https://www.geototal.az','az'],
 ['en-AZ','https://www.geototal.az','en'],
 ['ru-AZ','https://www.geototal.az','ru'],
 ['ky-KG','https://www.geototal.kg','ky'],
 ['en-KG','https://www.geototal.kg','en'],
 ['ru-KG','https://www.geototal.kg','ru'],
];
export function regionalAlternates(path='', available=['az','en','ru','ky']) {
 const normalized=publicPath(path).replace(/^\/+|\/+$/g,'');
 const suffix=normalized ? `/${normalized}` : '';
 const entries=variants.filter(([, ,locale])=>available.includes(locale))
  .map(([tag,origin,locale])=>[tag,`${origin}/${locale}${suffix}`]);
 const languages=Object.fromEntries(entries);
 // Stable fallback across domains, only when that translation exists.
 const fallback=['az-AZ','en-AZ','ru-AZ','ky-KG'].find(tag=>languages[tag]);
 if(fallback)languages['x-default']=languages[fallback];
 return languages;
}
export function blogLanguages(record) {
 return ['az','en','ru','ky'].filter(locale=>{
  const suffix={az:'',en:'En',ru:'Ru',ky:'Ky'}[locale];
  return record[`title${suffix}`]?.trim() && record[`description${suffix}`]?.trim();
 });
}
