# Macierz zgodności z PDF

| Obszar i oficjalna punktacja | Wymaganie | Realizacja | Dowód lub pozostały etap |
| --- | --- | --- | --- |
| LP · 25 pkt | Jedna oferta, określony odbiorca, cel i oznaczenie demonstracji | [Brief](brief.md), [makieta](struktura-lp.md), hero i stopka | Zrzuty LP, F01/F04 |
| LP · 25 pkt | Propozycja wartości, korzyści, obiekcje, co najmniej dwa CTA w odrębnych sekcjach | `index.html`: nawigacja, hero, końcowe CTA, korzyści, FAQ | F02/F03, A02 |
| LP · 25 pkt | Jedna sekcja przeznaczona do pomiaru | `#workshop_program`, [kontrakt](specyfikacja-zdarzen.md) | A03 w dwóch widokach; G02 do wykonania |
| LP · 25 pkt | Formularz z etykietami, błędami i sukcesem, dane fikcyjne | `form.js`, `index.html` | F05–F08, dwa zrzuty |
| LP · 25 pkt | Czytelność mobilna i desktopowa, klawiatura, title, description i lang | `style.css`, `main.js`, metadane w obu dokumentach | F01–F05; G00 na HTTPS do wykonania |
| LP · 25 pkt | Publiczny HTTPS | [GitHub Pages](../README.md#publikacja-github-pages), workflow | Wymagane repozytorium i G00 |
| LP · 25 pkt | Źródła grafik, informacje o narzędziach i zmianie zgód | [Źródła](zrodla-materialow.md), stopka i `privacy.html` | F01, Z06 |
| AI · 20 pkt | Struktura lub treść, UX/budowa, pomiar; polecenie, propozycja, ocena, weryfikacja | [D1–D3](decyzje-ai.md), fragmenty polecenia, wady i wyniki | Oceny obojga studentów do wpisania |
| AI · 20 pkt | Praca w parze, zamiana wykonującego i sprawdzającego, umiejętność wyjaśnienia decyzji | [Podział pracy](decyzje-ai.md#praca-w-parze) | Skład, zadania i własne uzasadnienia do wpisania |
| GTM i GA4 · 15 pkt | Jeden kontener web, tagi, reguły, zmienne, eksport opublikowanej wersji | `config.js`, [instrukcja GTM](../gtm/configuration-guide.md) | G01 i G06 oraz rzeczywisty eksport do wykonania |
| GTM i GA4 · 15 pkt | Pięć zdarzeń z parametrami, brak danych osobowych | `analytics.js`, [specyfikacja](specyfikacja-zdarzen.md) | A01–A07 lokalnie. G01/G02 i E04 do wykonania |
| GTM i GA4 · 15 pkt | Kluczowy generate_lead, lejek, zestawienie CTA | [Konfiguracja](../gtm/configuration-guide.md#2-google-analytics-4), [analiza](analiza-danych.md) | G02/G03, zrzuty z GA4 do wykonania |
| Meta i remarketing · 8 pkt | Rzeczywisty Pixel zespołu, PageView i Lead, potwierdzony odbiór | [Instrukcja Meta](../gtm/configuration-guide.md#3-meta-pixel-i-odbiorcy), tagi GTM | M01 do wykonania |
| Meta i remarketing · 8 pkt | Grupa 30 dni z wykluczeniem leadów, komunikat | [Reguły i koncepcja reklamy](remarketing.md) | M02 i dowód grupy do wykonania |
| Clarity · 5 pkt | Powiązany projekt, zgoda, maskowanie, kontrola instalacji, obserwacja UX | [Instrukcja Clarity](../gtm/configuration-guide.md#4-microsoft-clarity), `data-clarity-mask` | C01/C02, nagranie i mapy do wykonania |
| Zgody i testy negatywne · 7 pkt | Wariant podstawowy, niezależne zgody, odmowa, częściowa, pełna i wycofanie | `consent.js`, bramka GTM i warunki tagów, [kod mostu](../gtm/kod-tagow.md) | Z01–Z09 lokalnie; E01–E05 w Network i Preview do wykonania |
| Zgody i testy negatywne · 7 pkt | Formularz działa po odmowie, brak danych i konwersji po błędzie | `form.js`, CSP, brak nazw pól, deduplikacja | F05–F08, A04–A06 lokalnie; G02/M01/E04 do wykonania |
| Analiza i wyjaśnienie · 20 pkt | Miary, poprawne populacje, lejek, porównanie urządzeń, ograniczenia i rekomendacja | [Plan analizy](analiza-danych.md) i [raport](../raport.md) | Dane rzeczywiste, wnioski zespołu i rekomendacja na ich podstawie do wpisania |
| Przekazanie | Katalog/ZIP wg wzorca, raport, strona, GTM, podpisane dowody, daty i ograniczenia | [Raport](../raport.md), [indeks dowodów](../dowody/README.md) | Nazwiska, publiczny URL, dowody usług i finalny JSON do uzupełnienia |
