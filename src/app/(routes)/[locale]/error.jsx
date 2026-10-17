"use client";
import {useLocale} from 'next-intl';
const copy={az:['Məlumatlar hazırda yüklənmir. Bir az sonra yenidən cəhd edin.','Yenidən cəhd et'],en:['Content is temporarily unavailable. Please try again.','Try again'],ru:['Данные временно недоступны. Попробуйте ещё раз.','Повторить'],ky:['Маалымат убактылуу жеткиликсиз. Кайра аракет кылыңыз.','Кайра аракет кылуу']};
export default function ContentError({reset}) {
 const locale=useLocale();const [message,label]=copy[locale] || copy.az;
 return <section style={{padding:32}}><p role="alert">{message}</p><button onClick={reset}>{label}</button></section>;
}
