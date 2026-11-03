import {detailMetadata} from "@/lib/server-seo";
export async function generateMetadata({params}) {return detailMetadata(params.locale,"service",params.service);}
export default function DetailLayout({children}) {return children;}
