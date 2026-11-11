// Regional context is additive: original CMS copy and explicit SEO overrides stay intact.
export function regionalHomeCopy(region, locale) {
 const kg = region === 'KG';
 if (locale === 'en') {
  const country = kg ? 'Kyrgyzstan' : 'Azerbaijan';
  return {
   title: `Geodesy and Topographic Surveying Services in ${country}`,
   description: `GeoTotal provides ${kg ? '' : 'professional '}geodetic surveying, topographic mapping, LiDAR and drone surveying services in ${country}.`,
   intro: kg
    ? 'For surveying enquiries in Kyrgyzstan, contact the GeoTotal branch in Bishkek. Share the site location, available drawings and the required survey outputs so the scope, access arrangements and delivery requirements can be discussed with the branch.'
    : 'For surveying projects in Azerbaijan, contact the GeoTotal office in Baku. Our project portfolio includes Crescent and Hadrut. Share the site location, existing drawings and required outputs to discuss the scope of the work for your site.',
   contact: kg ? 'Contact the Kyrgyzstan branch' : 'Contact the Azerbaijan office',
  };
 }
 if (locale === 'ru') {
  const country = kg ? 'Кыргызстане' : 'Азербайджане';
  return {
   title: `Геодезические услуги и топографическая съёмка в ${country}`,
   description: `GeoTotal предлагает геодезические работы, топографическую съёмку, LiDAR и съёмку с дронов в ${country}.`,
   intro: kg
    ? 'По вопросам геодезических работ в Кыргызстане обратитесь в филиал GeoTotal в Бишкеке. Передайте местоположение участка, имеющиеся чертежи и требования к результатам. Состав работ, доступ на объект и условия передачи материалов согласовываются с филиалом.'
    : 'По вопросам геодезических работ в Азербайджане обратитесь в офис GeoTotal в Баку. В портфолио представлены проекты Crescent и Гадрут. Укажите расположение участка, передайте имеющиеся чертежи и требования к результатам для обсуждения объёма работ.',
   contact: kg ? 'Связаться с филиалом в Кыргызстане' : 'Связаться с офисом в Азербайджане',
  };
 }
 return null;
}
export function regionalServiceCopy(region, locale, name) {
 const home = regionalHomeCopy(region, locale);
 if (!home || !name) return null;
 const country = region === 'KG' ? (locale === 'en' ? 'Kyrgyzstan' : 'Кыргызстан') : (locale === 'en' ? 'Azerbaijan' : 'Азербайджан');
 return {
  ...home,
  title: `${name} — ${country}`,
  description: locale === 'en'
   ? `${name} in ${country}. Contact GeoTotal to discuss the site, scope of work and required deliverables.`
   : `${name} — ${country}. Свяжитесь с GeoTotal, чтобы обсудить объект, состав работ и требования к результатам.`,
 };
}
