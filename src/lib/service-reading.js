// Improve the existing AZ copy without replacing custom CMS text or translations.
const headings = {
 'Total Station ilə geodeziya ölçmələri': 'Geodeziya işləri necə aparılır?',
 'GNSS ölçmələri və topoqrafik planlar': 'Topoqrafik plan və təhvil materialları',
 'Nivelirləmə və hündürlük ölçmələri': 'Hündürlük ölçmələri və keyfiyyətə nəzarət',
};
export function serviceReading(service, locale, heading, text) {
 if (locale !== 'az' || !['geodeziya-topoqrafiya-xidmetleri', 'geodesy-and-topography'].includes(service)) return {heading, text};
 let formatted = text || '';
 // Exact phrases only: arbitrary CMS copy remains untouched.
 for (const [phrase, title] of [
  ['Qiymətə sahənin ölçüsü', 'Qiymət nədən asılıdır?'],
  ['Hansı planı sifariş etməliyəm?', 'Hansı planı sifariş etməliyəm?'],
  ['İş nə qədər çəkir?', 'İş nə qədər çəkir?'],
  ['Dron hər yerdə yerüstü ölçməni əvəz edirmi?', 'Dron yerüstü ölçməni əvəz edirmi?'],
 ]) {
  if (!formatted.includes(`### ${title}`) && formatted.includes(phrase)) {
   formatted = formatted.replace(phrase, `\n\n### ${title}\n\n${phrase.endsWith('?') ? '' : phrase}`);
  }
 }
 return {heading: headings[heading] || heading, text: formatted};
}

// Additive editorial copy: keep the CMS body and its regional overrides intact.
// Project scope verified against the published Crescent and Hadrut project pages.
const geodesyEvidence = {
 az: {
  title: 'Geodeziya ölçmələrindən layihə üçün istifadə olunan nəticəyə',
  intro: 'Geodeziya işinin nəticəsi yalnız ölçülmüş nöqtələr deyil: layihəçinin istifadə edə bildiyi, koordinat və hündürlük sistemi aydın olan materialdır. Topoqrafik çəkiliş mövcud vəziyyəti təsvir edir, tikinti geodeziyası isə layihədəki ox və səviyyələrin sahədə tətbiqinə və yoxlanmasına xidmət edir.',
  planningTitle: 'Sifarişdən əvvəl nəyi dəqiqləşdirək?',
  planning: 'Ərazinin yerini və sərhədini, işin məqsədini, mövcud planları və tələb olunan təhvil tarixini göndərin. Miqyas, koordinat və hündürlük sistemi, ölçüləcək elementlər və nəticə formatları texniki tapşırıqda razılaşdırılmalıdır. Beləliklə, topoqrafik plan, koordinat cədvəli və ya relyef modelindən hansının layihənizə lazım olduğunu müəyyənləşdirə bilərik. RTK/GNSS, taxeometr və nivelirləmə üsulları sahənin şəraitinə görə seçilir; bütün obyektlərə eyni dəqiqlik və müddət vəd edilmir.',
  projectsTitle: 'Azərbaycanda görülmüş real işlər',
  projects: [
   {slug:'crescent',title:'Crescent — tikinti və landşaftın geodeziya təminatı',text:'Crescent layihəsində landşaft üçün koordinat və hündürlük ölçmələri, körpünün oxlarının çıxarılması və tikinti prosesində geodeziya nəzarəti aparılıb. Metal konstruksiyaların montajında ox və hündürlüklər yoxlanılıb. Bu işlər mövcud ərazinin ölçülməsi ilə tikinti mərhələsində nəzarətin fərqli vəzifələrini göstərir.'},
   {slug:'hadrut-restoration',title:'Hadrut — bərpa layihəsi üçün topoqrafiya və LiDAR',text:'Hadrutun bərpası üzrə işlərdə mövcud tikililərin topoqrafik planalması və ərazinin aerolazer ölçmələri həyata keçirilib. Matrice 350 RTK və Zenmuse L2 ilə toplanan məlumatlar DJI Terra-da emal olunub; DTM/DSM və 3D model hazırlanıb. Nəticələr layihələndirmə və bərpa üçün rəqəmsal topoqrafik planlar şəklində təqdim edilib.'},
  ],
  read:'Layihədə görülən işlərə bax',
 },
 en: {
  title: 'From survey measurements to usable project information',
  intro: 'A geodetic survey should provide more than measured points: the designer needs usable information with a clearly defined coordinate and height reference system. A topographic survey records existing conditions, while construction surveying supports setting out and checking the axes and levels specified in a design.',
  planningTitle: 'What should we agree before a survey?',
  planning: 'Send the site location and boundary, the purpose of the work, existing plans and the required delivery date. The brief should define the scale, coordinate and height systems, features to be surveyed and output formats. This helps establish whether your project needs a topographic plan, a coordinate schedule or a terrain model. RTK/GNSS, total station and levelling methods are selected to suit site conditions; accuracy and turnaround are agreed for the individual scope rather than promised uniformly for every site.',
  projectsTitle: 'Surveying experience from projects in Azerbaijan',
  projects: [
   {slug:'crescent',title:'Crescent — surveying for construction and landscaping',text:'Work at Crescent included coordinate and height measurements for landscaping, bridge axis setting out and surveying supervision during construction. Axes and levels were also checked during steel structure assembly. The project illustrates the distinct roles of measuring existing conditions and checking construction against the design.'},
   {slug:'hadrut-restoration',title:'Hadrut — topographic and LiDAR surveys for restoration',text:'The Hadrut restoration work included topographic surveying of existing buildings and airborne laser measurements of the site. Data captured with a Matrice 350 RTK and Zenmuse L2 was processed in DJI Terra to prepare DTM/DSM and a 3D model. The results were delivered as digital topographic plans for design and restoration work.'},
  ],
  read:'Explore the project scope',
 },
 ru: {
  title: 'От геодезических измерений к материалам для проектирования',
  intro: 'Результат геодезических работ — не только измеренные точки, но и материалы, которыми проектировщик может пользоваться в определённой системе координат и высот. Топографическая съёмка отражает существующее состояние участка, а геодезическое сопровождение строительства помогает выносить и проверять предусмотренные проектом оси и отметки.',
  planningTitle: 'Что согласовать до начала съёмки?',
  planning: 'Передайте местоположение и границы участка, цель работ, имеющиеся планы и требуемую дату передачи результатов. В техническом задании согласовываются масштаб, системы координат и высот, состав снимаемых объектов и форматы материалов. Это позволяет определить, нужен ли вашему проекту топографический план, ведомость координат или модель рельефа. Методы RTK/GNSS, тахеометрии и нивелирования выбираются с учётом условий участка; одинаковые точность и срок для всех объектов не обещаются.',
  projectsTitle: 'Практический опыт на объектах в Азербайджане',
  projects: [
   {slug:'crescent',title:'Crescent — геодезическое обеспечение строительства и ландшафта',text:'На проекте Crescent выполнялись координатные и высотные измерения для ландшафтных работ, вынос осей моста и геодезический контроль строительства. При монтаже металлоконструкций проверялись оси и высоты. Проект показывает различие между съёмкой существующего участка и контролем соответствия строящихся конструкций проекту.'},
   {slug:'hadrut-restoration',title:'Гадрут — топография и LiDAR для восстановления',text:'Работы по восстановлению Гадрута включали топографическую съёмку существующих зданий и воздушное лазерное сканирование территории. Данные Matrice 350 RTK и Zenmuse L2 обрабатывались в DJI Terra с подготовкой DTM/DSM и 3D-модели. Результаты передавались в виде цифровых топографических планов для проектирования и восстановительных работ.'},
  ],
  read:'Посмотреть состав работ по проекту',
 },
 ky: {
  title: 'Геодезиялык өлчөөлөрдөн долбоорго керектүү материалдарга чейин',
  intro: 'Геодезиялык иштин натыйжасы — өлчөнгөн чекиттер гана эмес, координаттар жана бийиктиктер системасы так көрсөтүлгөн, долбоорлоочу колдоно ала турган материалдар. Топографиялык тартуу жердин учурдагы абалын көрсөтөт. Курулуштагы геодезия болсо долбоордогу окторду жана бийиктик белгилерин жерге чыгарууга жана текшерүүгө жардам берет.',
  planningTitle: 'Өлчөө башталганга чейин эмнени макулдашуу керек?',
  planning: 'Участоктун жайгашкан жерин жана чегин, иштин максатын, бар болгон пландарды жана натыйжаларды алуу мөөнөтүн жөнөтүңүз. Масштаб, координаттар жана бийиктиктер системасы, өлчөнө турган объекттер жана материалдардын форматтары техникалык тапшырмада макулдашылат. Ошондо долбоорго топографиялык план, координаттар тизмеси же рельеф модели керек экенин аныктоого болот. RTK/GNSS, тахеометрия жана нивелирлөө ыкмалары жердин шартына жараша тандалат; бардык объекттерге бирдей тактык жана мөөнөт убада кылынбайт.',
  projectsTitle: 'Азербайжанда аткарылган долбоорлордун тажрыйбасы',
  projects: [
   {slug:'crescent',title:'Crescent — курулуш жана ландшафт үчүн геодезия',text:'Crescent долбоорунда ландшафт иштери үчүн координаттар жана бийиктиктер өлчөнүп, көпүрөнүн октору жерге чыгарылган жана курулушка геодезиялык көзөмөл жүргүзүлгөн. Металл конструкцияларды монтаждоодо октор жана бийиктиктер текшерилген. Бул иштер учурдагы жерди өлчөө менен курулуштун долбоорго шайкештигин текшерүүнүн айырмасын көрсөтөт.'},
   {slug:'hadrut-restoration',title:'Гадрут — калыбына келтирүү үчүн топография жана LiDAR',text:'Гадрутту калыбына келтирүү иштеринде бар болгон имараттар топографиялык тартылып, аймакта абадан лазердик өлчөөлөр жүргүзүлгөн. Matrice 350 RTK жана Zenmuse L2 менен алынган маалыматтар DJI Terra программасында иштетилип, DTM/DSM жана 3D-модель даярдалган. Натыйжалар долбоорлоо жана калыбына келтирүү үчүн санариптик топографиялык пландар түрүндө берилген.'},
  ],
  read:'Долбоордо аткарылган иштерди көрүү',
 },
};

export function geodesyProjectCopy(service, locale) {
 if (!['geodeziya-topoqrafiya-xidmetleri', 'geodesy-and-topography'].includes(service)) return null;
 return geodesyEvidence[locale] || null;
}
