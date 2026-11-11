"use client";
import Link from "next/link";
import {regionalHomeCopy} from "@/lib/regional-content";
import {useLocale} from 'next-intl';
import {useDomainContact} from '@/i18n/domain-contact';
import {contentLabels} from '@/lib/content-labels';
import styles from '../../../../public/assets/css/module/pageheading.module.css';
export default function PageHeading({page,region}) {
 const locale=useLocale();const contact=useDomainContact();const text=contentLabels(locale);
 const country = region || (contact ? 'KG' : 'AZ');
 const regional = page === 'home' ? regionalHomeCopy(country,locale) : null;
 return <div className={styles.heading}><h1>{regional?.title || text[page==='home' && country==='KG'?'homeKg':page]}</h1>
 {regional && <div className={styles.context}><p>{regional.description}</p><p>{regional.intro}</p><Link href={`/${locale}/elaqe`}>{regional.contact}</Link></div>}
 </div>;
}
