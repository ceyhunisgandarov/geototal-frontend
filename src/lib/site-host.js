// Only exact public hosts may select a production region. Never interpolate an
// incoming Host value into canonical URLs. Proxy headers must be sanitized by hosting.
export function normalizedHost(host = '') {
 if (typeof host !== 'string') return '';
 const value = host.split(',')[0].trim().toLowerCase();
 if (!/^[a-z0-9.-]+(?::[0-9]+)?$/.test(value)) return '';
 return value.replace(/:\d+$/, '').replace(/\.$/, '');
}
export function hostRegion(host) {
 const name = normalizedHost(host);
 if (['geototal.az','www.geototal.az'].includes(name)) return 'AZ';
 if (['geototal.kg','www.geototal.kg'].includes(name)) return 'KG';
 return null;
}
