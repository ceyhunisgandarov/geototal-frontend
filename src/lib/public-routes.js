// Public URL segments only; API names and content keys remain unchanged.
export const publicRouteNames = Object.freeze({services:'xidmetler',projects:'layiheler',products:'mehsullar',aboutus:'haqqimizda',contact:'elaqe'});
export const serviceSlugAliases = Object.freeze({'geodesy-and-topography':'geodeziya-topoqrafiya-xidmetleri',photogrammetry:'Fotoqrammetriya-ortofoto-dron-pua',calibration:'kalibrasiya','control-and-outsourcing':'geodeziya-nezareti-xidmetleri',lidar:'dron-xidmetleri'});
export function publicPath(path) {
 const parts=path.split('/');
 const index=parts[0]==='' ? 1 : 0;
 const section=['az','en','ru','ky'].includes(parts[index]) ? index+1 : index;
 if (publicRouteNames[parts[section]]) parts[section]=publicRouteNames[parts[section]];
 if(parts[section]==='xidmetler' && serviceSlugAliases[parts[section+1]]) parts[section+1]=serviceSlugAliases[parts[section+1]];
 return parts.join('/');
}

// CMS Markdown can outlive a route rename. Resolve only our own URLs,
// preserving the destination domain, language, query string and fragment.
export function publicContentHref(href) {
 if (typeof href !== 'string' || !href) return href;
 if (href.startsWith('/') && !href.startsWith('//')) {
  const boundary = href.search(/[?#]/);
  return boundary < 0 ? publicPath(href) : publicPath(href.slice(0,boundary)) + href.slice(boundary);
 }
 if (!/^https?:\/\//i.test(href)) return href;
 try {
  const url = new URL(href);
  if (!['geototal.az','www.geototal.az','geototal.kg','www.geototal.kg'].includes(url.hostname)) return href;
  const path = publicPath(url.pathname);
  if (path === url.pathname) return href;
  url.pathname = path;
  return url.href;
 } catch { return href; }
}
