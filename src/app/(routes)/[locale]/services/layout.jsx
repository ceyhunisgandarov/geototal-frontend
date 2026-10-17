import {staticMetadata} from "@/lib/server-seo";
export function generateMetadata({params}) {return staticMetadata(params.locale,"services","services");}
export default function PageLayout({children}) {return children;}
