import {staticMetadata} from "@/lib/server-seo";
export function generateMetadata({params}) {return staticMetadata(params.locale,"contact","contact");}
export default function PageLayout({children}) {return children;}
