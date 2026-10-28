import ReactMarkdown from 'react-markdown';
import styles from './blog.module.css';
export default function BlogBody({text}) {
 return <div className={styles.body}><ReactMarkdown skipHtml components={{h1:({children})=><h2>{children}</h2>,img:({src,alt})=><img src={src} alt={alt || ''} loading="lazy" decoding="async" />}}>{text || ''}</ReactMarkdown></div>;
}
