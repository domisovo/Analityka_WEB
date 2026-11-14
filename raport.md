# EquiSoul · Raport projektu 1

## 1. Projekt i zespół

„Analityka aplikacji webowych”. Projekt 1, landing page z AI i analityką. Zespół **[imię i nazwisko 1]**, **[imię i nazwisko 2]**. Grupa **[uzupełnijcie]**. Testy lokalne **14.11.2026**. Testy na wdrożeniu **[data, wykonujący, sprawdzający]**.

## 2. Adres strony

Publiczny HTTPS **[adres z GitHub Pages]**. Repozytorium **[adres]**. W paczce znajduje się workflow publikacji i lokalna instrukcja startu. [README](README.md)

## 3. Brief biznesowy

EquiSoul to fikcyjna marka z ofertą „Pierwszy raz w siodle”. Jednodniowe, czterogodzinne warsztaty w okolicach Krakowa dla grupy maksymalnie sześciu dorosłych kosztują demonstracyjnie 249 zł. Program prowadzi od poznania konia i zasad bezpieczeństwa przez pielęgnację i przygotowanie do pierwszej jazdy pod opieką instruktora. [Brief](dokumentacja/brief.md)

## 4. Grupa docelowa

Dorośli zaczynający od zera lub z niewielkim doświadczeniem, zainteresowani nowym hobby i aktywnością w naturze. Najważniejsze pytania dotyczą kontaktu z koniem, tempa ćwiczeń, wsparcia, sprzętu i bezpieczeństwa.

## 5. Cel i konwersja

Główna akcja to ukończenie lokalnej próby formularza. Poprawna walidacja i widoczne potwierdzenie stanowią warunek `generate_lead`. Konwersja oznacza ukończenie demonstracji. W zależności od zgody może zostać przekazana GA4 lub Meta. Formularz realizuje cel niezależnie od zgód.

## 6. Struktura strony

Hero informuje, co jest oferowane, komu i jak przejść do formularza. Korzyści i program rozkładają pierwszy dzień na konkretne czynności. Galeria pokazuje otoczenie i przebieg w sposób ilustracyjny. Organizacja i FAQ odpowiadają na obawy, a trzy CTA kierują do tego samego formularza. [Makieta i uzasadnienie](dokumentacja/struktura-lp.md)

## 7. Wykorzystanie AI

Udokumentowano trzy decyzje dotyczące struktury, fokusu i walidacji oraz progu widoczności. Zapisano alternatywy, wady i wyniki testów. Własna ocena i decyzje zespołu **[uzupełnijcie po sprawdzeniu]**. [Decyzje AI](dokumentacja/decyzje-ai.md)

## 8. Architektura

Strona statyczna i podstrona prywatności. `main.js` obsługuje nawigację, `form.js` walidację i sygnały DOM, `consent.js` wybór i wycofanie zgód, `analytics.js` mapowanie sygnałów na jedną warstwę `dataLayer`, pomiar widoczności i bramkę ładowania GTM. `config.js` przechowuje publiczny identyfikator kontenera. Formularz działa w przeglądarce; pola są czyszczone po sukcesie i nie uczestniczą w żądaniach.

## 9. Zdarzenia analityczne

Pięć zdarzeń to `page_view`, `cta_click`, `section_view`, `form_start` i `generate_lead`. Zdarzenia zawierają parametry opisujące wyłącznie stronę, CTA, sekcję lub techniczny identyfikator formularza. [Warunki, parametry i deduplikacja](dokumentacja/specyfikacja-zdarzen.md)

## 10. GTM i GA4

Lokalny kod i instrukcje są gotowe do skonfigurowania. ID kontenera **[uzupełnijcie]**. ID GA4 **[uzupełnijcie]**. Wersja opublikowana GTM, data i plik eksportu **[uzupełnijcie po publikacji]**. Ręczne page_view i form_start wymagają wyłączenia odpowiedniego automatycznego pomiaru. Zdarzeniem kluczowym ma być `generate_lead`. [Przewodnik](gtm/configuration-guide.md)

## 11. Lejki i wskaźniki

Dwa lejki zaczynają się od `page_view`. Pierwszy zawiera CTA przed startem i leadem. Drugi obejmuje także dotarcie przez przewijanie. Widoczność programu to osobna analiza. Przygotowano liczniki, mianowniki oraz konfigurację zestawienia CTA i porównania urządzeń. Wyniki **[okres, wolumeny, wartości wskaźników, obserwacje]**. [Plan analizy](dokumentacja/analiza-danych.md)

## 12. Meta Pixel i remarketing

Tagi mają wysyłać PageView i Lead po zgodzie marketingowej. Po jej uzyskaniu skonfigurowany Pixel zasila grupę odwiedzających LP z ostatnich 30 dni z wykluczeniem odbiorców zdarzenia Lead w tym samym oknie. ID i źródło **[uzupełnijcie]**. Status grupy **[uzupełnijcie]**. [Konfiguracja i koncepcja komunikatu](dokumentacja/remarketing.md)

## 13. Microsoft Clarity

Projekt **[nazwa i ID]**. Tylko kategoria analityczna uruchamia tag. W kodzie formularz oraz ustawienia są oznaczone maską. Ustawienie Strict i jego zachowanie należy sprawdzić w projekcie Clarity. Weryfikacja instalacji, nagranie oraz mapy kliknięć i przewijania **[uzupełnijcie po testach]**. [Instrukcja](gtm/configuration-guide.md#4-microsoft-clarity)

## 14. Zgody

„EquiSoul – ustawienia zgód” to lokalny mechanizm demonstracyjny, bez certyfikacji CMP. Obie kategorie opcjonalne zaczynają jako denied. GTM jest wstrzymany przed pierwszą zgodą, a każdy tag ma osobną bramkę. `equisoul_consent_update` przekazuje bieżący stan do mostu Consent Mode v2. Wycofanie próbuje zatrzymać narzędzie i przeładowuje dokument z nową decyzją. Wariant Cookiebot opisano do zastosowania po sprawdzeniu konta i domeny. [Architektura oraz konfiguracja zgód](gtm/configuration-guide.md#1-kontener-i-prywatność)

## 15. Wyniki testów

W lokalnym przebiegu Playwright w Chromium 19 z 19 scenariuszy zakończyło się statusem PASS. Przebieg obejmuje poprawne i negatywne zakończenie formularza, klawiaturę, cztery szerokości, pięć zdarzeń, ścieżkę bez CTA, brak duplikacji i wszystkie lokalne scenariusze zgód. Wyniki i ograniczenia są przy każdym przypadku. Próby na usługach zewnętrznych mają status NOT TESTED. [Plan i wyniki](dokumentacja/plan-testow.md)

## 16. Dowody działania

Dołączono zrzuty dwóch wersji widoku, błędu e-maila, potwierdzenia i selektora zgód wraz z logiem testów. Indeks opisuje dla każdego dowodu widoczny wynik i granice interpretacji. Dowody z GTM Preview, GA4 DebugView i eksploracji, Meta Test Events i reguł grupy, Clarity oraz Network na wdrożeniu **[do uzupełnienia]**. [Indeks dowodów](dowody/README.md)

## 17. Ograniczenia

Lokalne przejście testów potwierdza warstwę aplikacji. Publikacja, odbiór u usługodawców i blokowanie faktycznych tagów wymagają rzeczywistych identyfikatorów i testu wdrożenia. Zgody i blokady ograniczają obserwowane populacje. Obie platformy mogą raportować inną liczebność nawet przy sprawnym wdrożeniu. Pomiar sekcji opiera się na geometrii, a testowy lead potwierdza wyłącznie demonstrację. Testy automatyczne wykorzystują Chromium i emulowane wymiary.

## 18. Rekomendacja optymalizacji

Po zebraniu danych porównajcie krok formularz–sukces według urządzenia. Jeśli w rzetelnej próbie mobile wykaże większy odpływ, przejrzyjcie nagrania z zamaskowanymi polami oraz sprawdźcie zadaniowo widoczność błędu i przycisku przy otwartej klawiaturze. Wersję z poprawką porównajcie przy tym samym kryterium ukończenia i porównywalnych warunkach. **[Obserwacja, wybrana zmiana i uzasadnienie po pomiarze]**.

## 19. Stan projektu

Landing page, walidacja, zgody, lokalna warstwa pomiarowa, workflow i instrukcje są w paczce. Przed oddaniem uzupełnijcie nazwiska, adres i daty, opublikujcie stronę i kontener, wyeksportujcie jego opublikowaną wersję, powtórzcie testy i dopiszcie ocenę AI. [Macierz zgodności](dokumentacja/macierz-zgodnosci.md)

## 20. Źródła

Instrukcja prowadzącego `00_Projekt_LP_analityka.pdf`, brief użytkownika, zasoby ImageGen i dokumentacja producentów narzędzi. [Źródła materiałów](dokumentacja/zrodla-materialow.md) · [Źródła integracji](gtm/configuration-guide.md)
