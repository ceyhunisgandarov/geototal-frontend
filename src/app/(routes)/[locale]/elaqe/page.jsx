import ContactUsContainer from "@/app/containers/contactus";
import {headers} from 'next/headers';
import {getRequestHost} from '@/lib/locales';
import {getDomainContact} from '@/lib/domain-contact';
import {getContact} from '@/lib/server-content';
export default async function ContactUsPage() {
 const domainContact = getDomainContact(getRequestHost(headers()));
 // Keep the contact page available when the contact API is temporarily offline.
 const initialData = domainContact || await getContact().catch(() => undefined);
 return <ContactUsContainer page="contact" initialData={initialData} />;
}
