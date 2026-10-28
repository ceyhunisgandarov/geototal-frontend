import Link from 'next/link';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import Layout from '@/app/components/layout';
import BlogBody from '@/app/components/blog/body';
import {getDetail} from '@/lib/server-content';
import {getRequestHost} from '@/lib/locales';
import {blogMetadata} from '@/lib/blog-metadata';
import {blogLabels} from '@/lib/blog-labels';
import styles from '@/app/components/blog/blog.module.css';
async function record(locale,slug) {
 const b=await getDetail('blog',slug),suffix={az:'',en:'En',ru:'Ru',ky:'Ky'}[locale];
 if(b.published!==true || !b[`title${suffix}`]?.trim() || !b[`description${suffix}`]?.trim())notFound();
 return {b,suffix};
}
export async function generateMetadata({params:{locale,slug}}) {const {b}=await record(locale,slug);return blogMetadata(getRequestHost(headers()),locale,b);}
export default async function BlogArticle({params:{locale,slug}}) {
 const {b,suffix}=await record(locale,slug),labels=blogLabels(locale);
 return <Layout page="blog" locale={locale}><div className={styles.page}><article className={styles.article}>
 <Link className={styles.back} href={`/${locale}/blog`}>{labels[4]}</Link><h1>{b[`title${suffix}`]}</h1>
 <BlogBody text={b[`description${suffix}`]}/></article></div></Layout>;
}
