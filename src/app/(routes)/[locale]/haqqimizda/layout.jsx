import {staticMetadata} from "@/lib/server-seo";
export function generateMetadata({params}) {return staticMetadata(params.locale,"aboutus","aboutus");}
export default function PageLayout({children}) {return children;}
