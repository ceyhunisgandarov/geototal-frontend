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
