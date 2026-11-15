# Plan testów i wyniki

## Wyniki lokalne

14.11.2026, Playwright i Chromium. Test lokalny potwierdza JS, DOM i geometrię. W scenariuszach CMP użyto kontrolowanego obiektu o interfejsie Cookiebot, z pustym identyfikatorem GTM. W całym przebiegu kontrolowano brak błędów JS, POST i zewnętrznych żądań. [Bieżący log](../dowody/wyniki-lokalne.json) · [Historia v1](../dowody/historia/v1/README.md)

| ID | Warunek i kroki | Oczekiwany wynik | Rzeczywisty wynik | Status | Dowód i zakres |
| --- | --- | --- | --- | --- | --- |
| F01 | Lokalna odmowa; użyj trzech kotwic i prywatności | Cele na stronie i podstrona | Kotwice i prywatność działały | PASS | JSON; localhost |
| F02/A02 | Kliknij 3 CTA | Wspólny cel, fokus i oddzielne lokalizacje | Trzy lokalizacje i fokus na formularzu | PASS | JSON; lokalna kolejka |
| F03 | Otwórz i zamknij FAQ klawiszami Space i Enter | Widoczne odpowiedzi i zwinięcie | 7 pytań zgodnych | PASS | JSON; Chromium |
| F04 | 320, 390, 768, 1366 px; otwórz i zamknij menu klawiaturą | Brak przewijania w poziomie i poprawny fokus | Cztery szerokości zgodne | PASS | [390 px](../dowody/lp/mobile.png), [1366 px](../dowody/lp/desktop.png); emulacja |
| F05/F06 | Lokalna odmowa; formularz klawiaturą z fikcyjnymi danymi | Fokus na sukcesie, pola puste, lokalny sygnał, brak ruchu sieciowego | Potwierdzenie i jeden lokalny sukces | PASS | JSON; bez dostawców |
| F07/A04 | Fokus, pusta próba, następnie edycja i błędny e-mail | 0 startów po pustej próbie, 1 po edycji, 0 sukcesów | Zgodne liczby i błędy | PASS | [Zrzut](../dowody/formularz/negatywny.png) i JSON; lokalnie |
| F08/A05/A06 | Poprawne fikcyjne dane, dwuklik | Jeden `lead_success`, przycisk disabled, brak wartości pól w URL, storage i kolejce | Zgodny komunikat, blokada, pojedynczy wpis, brak danych w kontrolowanych miejscach | PASS | [Zrzut](../dowody/formularz/sukces.png) i JSON; lokalnie |
| A01 | Wejście UTM, CTA, poprawny formularz | Wejściowe UTM pozostają. Bez zdarzeń dostawców w kolejce | Brak lokalnego `page_view`, `section_view`, `generate_lead` i `Lead` | PASS | JSON; automatyczna odsłona GA4 osobno |
| A03-390, A03-1366 | Wyświetl podsumowanie w 390×670 i 1366×900 | Co najmniej 50% widoczne, brak lokalnej emisji | 265/670 i 320/900 px, oba bloki w 100% widoczne, po 2100 ms brak lokalnego `section_view` | PASS | JSON; geometria, reguła GTM osobno |
| A07 | Dotarcie przez przewinięcie | Start i sukces bez CTA | `form_start → lead_success` | PASS | JSON; pełny lejek w GA4 do wykonania |
| Z01/Z02 | Nowy profil, potem odmowa i odświeżenie | Baner tylko przed decyzją, brak sieci do dostawców | Odmowa zapisana | PASS | JSON; panel lokalny |
| Z03/Z04/Z05 | Częściowe decyzje i obie kategorie, odświeżenie | Wybór zachowany, sygnały wyłącznie lokalne | Trzy ustawienia zgodne | PASS | JSON; bez CMP/GTM |
| Z06/Z08/Z09 | Odbierz zgodę, sprawdź drugą kartę i wymuszony błąd zapisu | Odczyt nowej decyzji po odświeżeniu | Scenariusze zgodne w trybie lokalnym | PASS | [Zrzut](../dowody/zgody/zmiana-wyboru.png) i JSON; lokalnie |
| CMP01 | Tryb docelowy bez ID, pusta decyzja, sukces i późniejszy sygnał CMP | Bez lokalnego banera, sukces nadal możliwy, brak odtworzenia | Zgodne | PASS | JSON; podstawiony obiekt, bez Cookiebot |
| CMP02/CMP03 | Podaj oddzielnie statystykę i marketing, użyj preferencji | Wywołanie renew, CTA/start tylko dla analityki, sukces dla uprawnionej kategorii | Oba scenariusze zgodne | PASS | JSON; podstawiony obiekt, brak transmisji dostawców |
| CMP04 | Podaj obie zgody, następnie podwójną notyfikację odmowy | Jedno przeładowanie i brak pętli | Jedno przeładowanie i odmowa w nowym dokumencie | PASS | JSON; podstawiony obiekt, brak transmisji dostawców |

## Próby z GTM, GA4, Meta i Clarity

Warunek ogólny to właściwy publiczny HTTPS, skonfigurowane konta i ostatnia wersja plików. Używajcie świeżego profilu oraz danych fikcyjnych. Zbierajcie osobno sygnał, wyzwolenie tagu i odbiór. W Network zaznaczcie **Preserve log**. Dowody mają opisy, wersję i datę. Rozróżnijcie zasoby infrastruktury (GTM, Cookiebot, Preview) i hity pomiarowe (`/g/collect`, `facebook.com/tr`, `*.clarity.ms`).

| ID | Kroki i warunek | Oczekiwane | Wynik rzeczywisty | Status | Dowód i zakres |
| --- | --- | --- | --- | --- | --- |
| P01 | Otwórz publiczny URL w drugiej przeglądarce i sprawdź 390/1366 px | HTTPS, zasoby i interakcje działają | [uzupełnijcie] | NOT TESTED | dowody/lp; wersja i czas |
| G01 | Preview; po zapisanej zgodzie analitycznej odśwież od góry i kliknij dwa CTA | Jedna automatyczna odsłona i dwa `cta_click` z różnymi lokalizacjami | [uzupełnijcie] | NOT TESTED | dowody/gtm + ga4; Tag Assistant i DebugView |
| G02 | Zgoda zapisana, zacznij od góry. Krótka próba <2 s i oddzielne wczytanie z 50% przez ≥2 s. Wyjdź i wróć w drugiej próbie | 0 i 1 `section_view`; poprawne `section_id`, powrót nie powiela | [uzupełnijcie] | NOT TESTED | dowody/gtm + ga4; Percent Visible, czas, DebugView; nie dowodzi lektury |
| G03 | Pusta próba, potem edycja błędnego e-maila i ponowne wysłanie | Najpierw 0 `form_start`, później 1; 0 sukcesów we wszystkich warstwach | [uzupełnijcie] | NOT TESTED | dowody/formularz + gtm + ga4; negatywny dowód z sesji |
| G04 | Poprawne fikcyjne dane, obie zgody, dwuklik | Jedno `lead_success`, jeden `generate_lead` i jeden Meta `Lead` | [uzupełnijcie] | NOT TESTED | dowody/ga4 + meta; odbiór oraz parametry bez wartości pól |
| G05 | Opublikuj właściwą wersję i otwórz LP w świeżym profilu poza Preview | Realtime, poprawne tagi i dostępny finalny JSON | [uzupełnijcie] | NOT TESTED | dowody/gtm i ga4, gtm/container-published.json; konkretna wersja |
| G06 | Ukończ 6 prób UTM; zbuduj eksploracje i sprawdź wymiary i zdarzenie kluczowe | Poprawna konfiguracja, uzupełnione rzeczywiste N1/N2/N3 i CTA po przetworzeniu | [uzupełnijcie] | NOT TESTED | dowody/ga4; testowy okres i populacja |
| M01 | Sam marketing; testuj PageView, puste/błędne dane, poprawny dwuklik | Jeden PageView, brak błędnych Lead, jeden poprawny Lead | [uzupełnijcie] | NOT TESTED | dowody/meta; Test Events i Network |
| M02 | Utwórz grupę witryny i wykluczenie Lead | Zakres LP oraz dwa okna po 30 dni | [uzupełnijcie] | NOT TESTED | dowody/meta; zrzut reguł bez potwierdzania skali |
| C01 | Oficjalny tag, Strict, tylko analityka; test metadata i nowe nagranie | Analityka GRANTED, reklama DENIED; wartości pól nieczytelne | [uzupełnijcie] | NOT TESTED | dowody/clarity; stan, instalacja, konkretne nagranie |
| C02 | Próba drugiej pary na LP; odszukaj czas, urządzenie i mapy | Nagranie i dostępne mapy, obserwacja i alternatywna hipoteza | [uzupełnijcie] | NOT TESTED | dowody/clarity; liczba sesji, ograniczona interpretacja |

## Macierz zgód na opublikowanym LP

Powtórzcie w Preview i po publikacji. „Działa” oznacza oczekiwaną możliwość uruchomienia przy pasującej regule. Dla czterech stanów Consent Mode kolejność kolumn w nawiasie to `analytics_storage / ad_storage / ad_user_data / ad_personalization`.

| ID i wybór | Oczekiwany Consent Mode | GA4 | Meta | Clarity | Faktyczny wynik, dowód Preview i Network | Status |
| --- | --- | --- | --- | --- | --- | --- |
| E01 Brak decyzji | D/D/D/D | Blokada | Blokada | Blokada | [uzupełnijcie] | NOT TESTED |
| E02 Odmowa wszystkich i odświeżenie | D/D/D/D | Blokada | Blokada | Blokada | [uzupełnijcie] | NOT TESTED |
| E03 Tylko analityka | G/D/D/D | Działa | Blokada | Działa, reklama DENIED | [uzupełnijcie] | NOT TESTED |
| E04 Tylko marketing | D/G/G/G | Blokada | Działa | Blokada | [uzupełnijcie] | NOT TESTED |
| E05 Obie kategorie | G/G/G/G | Działa | Działa | Działa | [uzupełnijcie] | NOT TESTED |
| E06 Odbierz analitykę po obu, po przeładowaniu | D/G/G/G | Blokada | Działa | Blokada | [uzupełnijcie] | NOT TESTED |
| E07 Odbierz marketing po obu, po przeładowaniu | G/D/D/D | Działa | Blokada | Działa, reklama DENIED | [uzupełnijcie] | NOT TESTED |
| E08 Odbierz obie, po przeładowaniu | D/D/D/D | Blokada | Blokada | Blokada | [uzupełnijcie] | NOT TESTED |

Używajcie różnych czystych profili dla niezależnych wierszy. W E06–E08 najpierw sprawdźcie uruchomienie bibliotek przy pełnej zgodzie, potem jedno przeładowanie, właściwy zapis, brak hitów odwołanych usług i aktualne sygnały Clarity. Zapiszcie ewentualne żądania zainicjowane wcześniej, widoczne przy zamykaniu starego dokumentu. `D` oznacza denied, `G` granted. [Gdzie zapisać dowody](../dowody/README.md)
