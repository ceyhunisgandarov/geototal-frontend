"use client";
import {useLocale} from 'next-intl';
import {useDomainContact} from '@/i18n/domain-contact';
import {contentLabels} from '@/lib/content-labels';
import styles from '../../../../public/assets/css/module/pageheading.module.css';
export default function PageHeading({page}) {
 const locale=useLocale();const contact=useDomainContact();const text=contentLabels(locale);
 return <div className={styles.heading}><h1>{text[page==='home' && contact?'homeKg':page]}</h1></div>;
}
