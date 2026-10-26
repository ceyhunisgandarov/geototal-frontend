const copy = {
 az: {
  home: ['Geodeziya və Topoqrafiya Xidmətləri', 'GeoTotal Azərbaycanda geodeziya və topoqrafiya, dronla xəritəçəkmə, LiDAR çəkilişi və ölçmə avadanlıqlarının kalibrlənməsi xidmətləri təqdim edir.'],
  services: ['Geodeziya və topoqrafiya xidmətləri', 'GeoTotal-ın geodeziya, topoqrafiya, fotoqrammetriya, LiDAR, kalibrlənmə və tikintidə geodeziya nəzarəti xidmətləri ilə tanış olun.'],
  projects: ['Geodeziya və topoqrafiya layihələri', 'GeoTotal-ın iştirak etdiyi layihələr, görülən ölçmə işləri və layihə məlumatları ilə tanış olun.'],
  aboutus: ['GeoTotal haqqında', 'GeoTotal şirkəti, geodeziya və topoqrafiya sahəsində fəaliyyəti, təcrübəsi və iş yanaşması haqqında məlumat alın.'],
  references: ['GeoTotal referansları', 'GeoTotal-ın referansları və əməkdaşlıq məlumatları ilə tanış olun.'],
  products: ['Geodeziya və ölçmə avadanlıqları', 'GeoTotal kataloqunda geodeziya və ölçmə avadanlıqlarını araşdırın, məhsulların xüsusiyyətləri ilə tanış olun.'],
  contact: ['GeoTotal ilə əlaqə', 'Geodeziya və topoqrafiya layihəniz barədə GeoTotal ilə əlaqə saxlayın. Telefon, email və ünvan məlumatları.']
 },
 en: {
  home: ['Geodesy and Topographic Surveying', 'GeoTotal provides geodetic and topographic surveying, drone mapping, LiDAR surveys and surveying equipment calibration.'],
  services: ['Geodesy and Surveying Services', 'Explore GeoTotal services in geodesy, topography, photogrammetry, LiDAR, equipment calibration and construction surveying supervision.'],
  projects: ['Geodesy and Surveying Projects', 'Explore projects involving GeoTotal, surveying work and project information.'],
  aboutus: ['About GeoTotal', 'Learn about GeoTotal, our experience in geodesy and topographic surveying, and our approach to project work.'],
  references: ['GeoTotal References', 'Explore GeoTotal references and collaboration information.'],
  products: ['Surveying Equipment', 'Explore the GeoTotal catalogue of surveying and measurement equipment and find product specifications.'],
  contact: ['Contact GeoTotal', 'Contact GeoTotal about your surveying project. Find our phone numbers, email and address.']
 },
 ru: {
  home: ['Геодезия и топографическая съёмка', 'GeoTotal предлагает геодезические и топографические работы, картографирование с дронов, LiDAR-съёмку и калибровку геодезического оборудования.'],
  services: ['Геодезические и топографические услуги', 'Услуги GeoTotal: геодезия, топография, фотограмметрия, LiDAR, калибровка оборудования и геодезический контроль строительства.'],
  projects: ['Геодезические и топографические проекты', 'Ознакомьтесь с проектами с участием GeoTotal, выполненными измерительными работами и информацией о проектах.'],
  aboutus: ['О компании GeoTotal', 'Узнайте о компании GeoTotal, её опыте в геодезии и топографии и подходе к выполнению проектов.'],
  references: ['Референсы GeoTotal', 'Ознакомьтесь с референсами GeoTotal и информацией о сотрудничестве.'],
  products: ['Геодезическое оборудование', 'Изучите каталог геодезического и измерительного оборудования GeoTotal и характеристики продукции.'],
  contact: ['Контакты GeoTotal', 'Свяжитесь с GeoTotal по вопросам геодезических работ. Телефоны, электронная почта и адрес компании.']
 },
 ky: {
  home: ['Геодезия жана топография кызматтары', 'GeoTotal геодезия, топография, дрон менен карта түзүү, LiDAR тартуу жана геодезиялык жабдууларды калибрлөө кызматтарын сунуштайт.'],
  services: ['Геодезия жана топография кызматтары', 'GeoTotal компаниясынын геодезия, топография, фотограмметрия, LiDAR, калибрлөө жана курулуштагы геодезиялык көзөмөл кызматтары.'],
  projects: ['Геодезия жана топография долбоорлору', 'GeoTotal катышкан долбоорлор, өлчөө иштери жана долбоорлор тууралуу маалымат менен таанышыңыз.'],
  aboutus: ['GeoTotal жөнүндө', 'GeoTotal компаниясы, геодезия жана топография тармагындагы тажрыйбасы жана ишке болгон мамилеси тууралуу маалымат.'],
  references: ['GeoTotal референстери', 'GeoTotal компаниясынын референстери жана кызматташтык тууралуу маалымат менен таанышыңыз.'],
  products: ['Геодезиялык жабдуулар', 'GeoTotal каталогундагы геодезиялык жана өлчөө жабдууларын, алардын техникалык мүнөздөмөлөрүн караңыз.'],
  contact: ['GeoTotal менен байланыш', 'Геодезиялык долбооруңуз боюнча GeoTotal менен байланышыңыз. Телефон, электрондук почта жана дарек маалыматы.']
 }
};
export function seoSite(host = '', locale = 'az') {
 const hostname = host.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
 const kg = ['geototal.kg', 'www.geototal.kg'].includes(hostname) || (['localhost', '127.0.0.1', ''].includes(hostname) && locale === 'ky');
 return kg ? {origin:'https://www.geototal.kg', locales:['ky','en','ru'], defaultLocale:'ky', country:{en:'Kyrgyzstan',ru:'Кыргызстан',ky:'Кыргызстан'}} : {origin:'https://www.geototal.az',locales:['az','en','ru'],defaultLocale:'az',country:{az:'Azərbaycan',en:'Azerbaijan',ru:'Азербайджан'}};
}
export function cleanDescription(value, summarize = true) {
 if (typeof value !== 'string') return '';
 const text = value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ').trim();
 if (!summarize || text.length <= 180) return text;
 // A complete sentence is preferable to enforcing an arbitrary character cap.
 const sentences = Array.from(new Intl.Segmenter(undefined, {granularity: 'sentence'}).segment(text), part => part.segment.trim());
 let result = sentences[0] || text;
 for (const sentence of sentences.slice(1)) {
  if (result.length + sentence.length + 1 > 180) break;
  result += ' ' + sentence;
 }
 return result;
}
export function pageMetadata({host,locale='az',page='home',path='',title,description,seoDescription}) {
 const site=seoSite(host,locale);
 const language=site.locales.includes(locale)?locale:site.defaultLocale;
 const texts=copy[language][page] || copy[language].home;
 const suffix=path ? '/' + path.replace(/^\/+|\/+$/g,'') : '';
 const url=lang=>`${site.origin}/${lang}${suffix}`;
 const languages=Object.fromEntries(site.locales.map(lang=>[lang,url(lang)]));
 languages['x-default']=url(site.defaultLocale);
 return {
  title: `${title || texts[0]} | GeoTotal${page==='home' ? ' '+site.country[language] : ''}`,
  description:cleanDescription(seoDescription, false) || cleanDescription(description) || texts[1],
  alternates:{canonical:url(language),languages}
 };
}
