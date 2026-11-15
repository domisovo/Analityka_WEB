# Macierz zgodności z sześcioma instrukcjami

Szczegółowy audyt zmian względem pierwszej wersji jest w [audycie rewizji](audyt-rewizji.md). Statusy dotyczą tylko wykonanych rodzajów weryfikacji.

| Instrukcja i zakres | Wymaganie | Realizacja | Dowód lub następny krok |
| --- | --- | --- | --- |
| 00 · Projekt LP (25 pkt) | Jedna oferta, odbiorca, cel, dwa CTA minimum, treść obiekcji, demonstracja, formularz i responsywność | Istniejący LP, 3 CTA, korzyści, FAQ, program, prywatność i fikcyjne dane | F01–F08 lokalnie; P01 po publikacji |
| 00 · AI (20 pkt) | Trzy decyzje, problem, własne uzasadnienie i weryfikacja | [Dziennik AI](decyzje-ai.md) z historią i bieżącą rewizją | Własne oceny i udział obu studentów do wpisania |
| 00 · Wdrożenie i testy (35 pkt) | Jedna instalacja GTM, GA4, rzeczywisty Pixel, Clarity, zgody, dowody | [Przewodnik](../gtm/configuration-guide.md), [testy](plan-testow.md) | GTM/GA4 15, Meta 8, Clarity 5, zgody i negatywne 7. Odbiór, publiczny HTTPS i eksport NOT TESTED |
| 00 · Analiza (20 pkt) | Populacja, miary, wyjaśnienie, ograniczenia | [Plan analizy](analiza-danych.md) i wnioski raportu | Liczebności i obserwacje po rzeczywistym pomiarze |
| 01 · Brief i konkurencja | Pełna tabela, krytyka AI, ocena podobnego LP | [Brief](brief.md), [arkusz analizy](analiza-konkurencji.md) | Analiza konkretnej strony i własne decyzje studentów do wykonania |
| 01 · Struktura i tekst | Dwa warianty, trzy kryteria, pytanie/odpowiedź/akcja, 2 makiety, 3 zestawy nagłówka i CTA | [Porównanie i makiety](struktura-lp.md), materiały retrospektywne | Treść zachowana; ocena drugiej pary NOT TESTED |
| 01 · Pomiar i praca w parze | Tabela pytań, bazowy lejek, źródła i role | [Plan pomiarowy](plan-pomiarowy.md), [źródła](zrodla-materialow.md), [arkusz prób](testy-z-druga-para.md) | Podział pracy i dowód wywiadu do uzupełnienia |
| 02 · Budowa i projekt widoku | HTML/CSS/JS, stabilne ID, 390/1366 px, publikacja HTTPS | `strona/`, F04, istniejący workflow Pages | [Zrzuty](../dowody/README.md), P01 NOT TESTED |
| 02 · Formularz i lokalny pomiar | Czytelny błąd, dokładne potwierdzenie, przycisk disabled, brak transportu i danych w sygnale; trzy sygnały | `form.js`, `analytics.js`, [słownik](specyfikacja-zdarzen.md) | F07/A04, F08/A05/A06 i A07; druga para NOT TESTED |
| 02 · Test z parą i rewizja | Zadanie, dwie obserwacje, hipoteza, ponowna próba i historia | [Arkusz](testy-z-druga-para.md), [v1](../dowody/historia/v1/README.md) | Próba użytkownika i obserwacje do wykonania |
| 03 · Cookiebot i Consent v2 | Consent Initialization, 4 domyślne denied, cookie_consent_update, renew, przeładowanie | Adapter rozłącznych trybów i [konfiguracja](../gtm/configuration-guide.md#1-cookiebot-i-podstawowy-consent-mode-v2) | CMP01–04 lokalnie z testowym API; E01–08 NOT TESTED |
| 03 · GTM i GA4 | Automatyczny page_view, 3 Custom Events, 50%/2000 ms, raz, 3 wymiary, zdarzenie kluczowe | [Tagi](../gtm/configuration-guide.md#2-zmienne-reguły-i-tagi) i [słownik](specyfikacja-zdarzen.md) | A01, A03 i A04 lokalnie. G01–G06 NOT TESTED |
| 03 · Raportowanie | Bazowy lejek, CTA według lokalizacji i Event count, dwa UTM, sześć prób, N1/N2/N3 | [Plan analizy i próby](analiza-danych.md) | Próby U01–U06 oraz wyniki NOT TESTED |
| 04 · Meta | Base/PageView i Lead, sekwencjonowanie, blokady i odbiór | [Kod i sekwencje](../gtm/kod-tagow.md) | M01 i G04 NOT TESTED |
| 04 · Remarketing | Zakres LP, 30 dni, wykluczenie Lead, dwa komunikaty | [Specyfikacja i warianty](remarketing.md) | M02 i własna redakcja zespołu do wykonania |
| 04 · Clarity i końcowa kontrola | Official, GCM, Strict, próba, obserwacja, macierz zgód i eksport | [Przewodnik](../gtm/configuration-guide.md#4-meta-i-clarity), [macierz](plan-testow.md#macierz-zgód-na-opublikowanym-lp), [raport](../raport.md) | C01/C02, E01–08, G05 NOT TESTED |
| 05 · Raport | Dane projektu, sekcje 1–8, tabele zdarzeń, prób i zgód, GA4, Meta, Clarity, podpisane dowody | [Raport](../raport.md) i [indeks dowodów](../dowody/README.md) | Nazwiska, usługi, obserwacje, dane i eksport do uzupełnienia |
