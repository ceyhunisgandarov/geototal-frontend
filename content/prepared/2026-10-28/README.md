# GeoTotal — məzmunun yerləşdirilməsi

Tarix: 28 oktyabr 2026

Hazırlanıb: 5 xidmət, 13 layihə, 2 bloq; Azərbaycan, ingilis, rus və qırğız dillərində 80 versiya. Mətnlər canlı bazaya yazılmayıb. Tərcümələr redaktə edilmiş hazırlıq variantlarıdır; dərcdən əvvəl terminoloji baxış tövsiyə olunur.

## Baxış

index.html faylını brauzerdə açın. Hər mətnin AZ, EN, RU, KY keçidi, SEO başlığı, təsviri və yoxlama qeydləri var. Bu önbaxış saytın yekun dizaynını deyil, yerləşdiriləcək məzmunu göstərir.

## Yerləşdirmə sırası

1. Backend dəyişikliklərini deploy edin. Yeni SEO başlığı sahələri, bloqun SEO təsvirləri, published sahəsi və uzun mətn sahələri tələb olunur. Mövcud nullable SEO sahələrinin boş qalması məzmunu silmir; sayt əvvəlki fallback mətnindən istifadə edir.
2. Frontendi deploy edin. public/images/blog daxilindəki şəkillər də frontend ilə yerləşdirilməlidir.
3. Admin paneldə xidmət və ya layihənin mövcud redaktə formasını açın. “Hazırlanmış ... mətnini aç” seçicisindən uyğun JSON-u seçin. Slug uyğun gəlmədikdə fayl qəbul edilmir. Yükləmə bazaya yazmır; bütün dillərə baxıb Save düyməsini basın.
4. Xidmət paketi bölmə mətnlərini yeniləyir. Mövcud hissələrin ID və şəkilləri sıra üzrə saxlanır; əlavə hissəyə istəsəniz şəkil seçin. Az sayda bölmə olan paket artıq hissələri çıxarır; saxlamadan əvvəl siyahıya baxın.
5. Blog → Add Blog → uyğun JSON. Məqalə Markdown formatındadır; şəkil, mənbə və daxili keçidlər daxildir. Paneldə hər dilin önbaxışı var. Əvvəl qaralama saxlayın, sonra “Yayımla” seçimini aktivləşdirin. Dörd dilin başlıq və mətni olmadan dərc edilmir.
6. Yayımlanan bloqlar /az/blog, /en/blog, /ru/blog və /ky/blog altında açılır. Sitemap domenə uyğun dilləri göstərir: .az → AZ/EN/RU; .kg → KY/EN/RU. Bu mövcud domen strategiyası saxlanılıb.

## Dərcdən əvvəl yoxlanacaq məqamlar

- Günəş stansiyasının 160 MVt, təxminən 400 ha, 1:1000, 0,5 m və 5,5 sm RMSE göstəricilərini faktiki layihə hesabatı ilə təsdiqləyin. Bunlar sənəddən götürülüb, ayrıca təsdiqlənməyib.
- Panorama layihəsinin yeri mənbədə olmadığı üçün əlavə edilməyib.
- Layihələr üzrə iş həcmi, şirkət adları və müqavilə rolları təsdiqlənməlidir.
- Hadrutun düzgün rusca hazırlıq mətni paketdə var. Razılaşmaya uyğun canlı düzəlişi istifadəçi paneldən edəcək.
- AI məqaləsi gələcək tətbiq imkanlarını faktiki layihədə AI işlədilməsi kimi təqdim etmir. Crescent koordinat sxemi faktiki ölçmə nəticəsi deyil; izahı saxlanılıb.
- Mövcud bloqların yeni published sahəsi boşdursa, onlar qaralama sayılır. Admin siyahısından yoxlayıb ayrıca yayımlayın.

## Bu paketə daxil olmayan hesab əməliyyatları

Search Console-a sitemap təqdim edilməsi, Google indekslənməsinin təsdiqi və Google Business Profile dəyişiklikləri edilməyib. Bunlar hesab girişləri ilə ayrıca görülür. Mobil Core Web Vitals ölçülməsi bu məzmun hazırlığının nəticəsi deyil.
