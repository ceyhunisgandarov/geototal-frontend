import {publicPath} from './public-routes.js';
const copy = {
 az: ['Bu layihə ilə əlaqəli xidmətlər', 'Geodeziya və topoqrafiya xidmətləri', 'Tikintidə geodeziya nəzarəti', 'Dronla LiDAR çəkilişi'],
 en: ['Services related to this project', 'Geodetic and topographic surveying', 'Construction surveying supervision', 'Drone LiDAR surveys'],
 ru: ['Услуги, связанные с проектом', 'Геодезические работы и топографическая съёмка', 'Геодезический контроль строительства', 'Съёмка LiDAR с дронов'],
 ky: ['Долбоорго байланыштуу кызматтар', 'Геодезия жана топография кызматтары', 'Курулуштагы геодезиялык көзөмөл', 'Дрон менен LiDAR тартуу'],
};
// Only associate projects whose published scope supports these services.
export function projectServiceLinks(project, locale) {
 const labels = copy[locale];
 if (!labels || !['crescent', 'hadrut-restoration'].includes(project)) return null;
 const items = [[1, 'geodesy-and-topography'], project === 'crescent' ? [2, 'control-and-outsourcing'] : [3, 'lidar']];
 return {title: labels[0], items: items.map(([label, slug]) => ({label: labels[label], href: publicPath(`/${locale}/services/${slug}`)}))};
}
