import {staticMetadata} from "@/lib/server-seo";
export function generateMetadata({params}) {return staticMetadata(params.locale,"references","aboutus/references");}
export default function PageLayout({children}) {return children;}
