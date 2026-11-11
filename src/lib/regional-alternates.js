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

const hasText = value => typeof value === 'string' && Boolean(value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim());
// Do not use display fallbacks to advertise an untranslated page to search engines.
export function contentLanguages(kind, record) {
 if (!record) return [];
 if (kind === 'blog') return blogLanguages(record);
 return ['az','en','ru','ky'].filter(locale => {
  const suffix = locale === 'az' ? '' : locale[0].toUpperCase()+locale.slice(1);
  if (kind === 'service') return hasText(record['serviceName'+suffix]) &&
   Array.isArray(record.serviceParts) && record.serviceParts.length > 0 &&
   record.serviceParts.every(part => hasText(part['serviceText'+(suffix || 'Az')]));
  if (kind === 'project') return hasText(record['projectName'+suffix]) && hasText(record['worksDescription'+suffix]);
  if (kind === 'product') return hasText(record.brand || record.model) && hasText(record['description'+(suffix || 'Az')]);
  return false;
 });
}
