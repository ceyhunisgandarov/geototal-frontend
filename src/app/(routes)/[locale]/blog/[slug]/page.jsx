import Link from 'next/link';
import {headers} from 'next/headers';
import {notFound} from 'next/navigation';
import Layout from '@/app/components/layout';
import BlogBody from '@/app/components/blog/body';
import {getDetail} from '@/lib/server-content';
import {getRequestHost} from '@/lib/locales';
import {blogMetadata} from '@/lib/blog-metadata';
import {blogLabels} from '@/lib/blog-labels';
import {seoSite} from '@/lib/seo';
import styles from '@/app/components/blog/blog.module.css';
async function record(locale,slug) {
 const b=await getDetail('blog',slug),suffix={az:'',en:'En',ru:'Ru',ky:'Ky'}[locale];
 if(b.published!==true || !b[`title${suffix}`]?.trim() || !b[`description${suffix}`]?.trim())notFound();
 return {b,suffix};
}
export async function generateMetadata({params:{locale,slug}}) {const {b}=await record(locale,slug);return blogMetadata(getRequestHost(headers()),locale,b);}
export default async function BlogArticle({params:{locale,slug}}) {
 const {b,suffix}=await record(locale,slug),labels=blogLabels(locale);
 const site=seoSite(getRequestHost(headers()),locale);
 const url=`${site.origin}/${locale}/blog/${encodeURIComponent(b.slug)}`;
 const schema={'@context':'https://schema.org','@graph':[
  {'@type':'BlogPosting',headline:b[`title${suffix}`],inLanguage:locale,url,mainEntityOfPage:url,publisher:{'@type':'Organization',name:'GeoTotal',url:site.origin}},
  {'@type':'BreadcrumbList',itemListElement:[
   {'@type':'ListItem',position:1,name:'GeoTotal',item:`${site.origin}/${locale}`},
   {'@type':'ListItem',position:2,name:labels[0],item:`${site.origin}/${locale}/blog`},
   {'@type':'ListItem',position:3,name:b[`title${suffix}`],item:url}
  ]}
 ]};
 return <Layout page="blog" locale={locale}><div className={styles.page}><article className={styles.article}>
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} />
 <Link className={styles.back} href={`/${locale}/blog`}>{labels[4]}</Link><h1>{b[`title${suffix}`]}</h1>
 <BlogBody text={b[`description${suffix}`]}/></article></div></Layout>;
}
