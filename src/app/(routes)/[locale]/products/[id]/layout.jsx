import {detailMetadata} from "@/lib/server-seo";
export async function generateMetadata({params}) {return detailMetadata(params.locale,"product",params.id);}
export default function DetailLayout({children}) {return children;}
