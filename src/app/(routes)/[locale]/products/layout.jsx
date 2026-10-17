import {staticMetadata} from "@/lib/server-seo";
export function generateMetadata({params}) {return staticMetadata(params.locale,"products","products");}
export default function PageLayout({children}) {return children;}
