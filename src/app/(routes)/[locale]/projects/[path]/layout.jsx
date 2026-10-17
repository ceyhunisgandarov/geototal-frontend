import {detailMetadata} from "@/lib/server-seo";
export async function generateMetadata({params}) {return detailMetadata(params.locale,"project",params.path);}
export default function DetailLayout({children}) {return children;}
