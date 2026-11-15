# Raport projektu LP z AI i analityką

## Informacje o projekcie

| Pole | Odpowiedź |
| --- | --- |
| Nazwa | EquiSoul · Pierwszy raz w siodle |
| Autorzy | [imię i nazwisko 1], [imię i nazwisko 2] |
| Publiczny adres LP | [publiczny HTTPS i ścieżka z GitHub Pages] |
| Data i zakres testów | 14.11.2026, 22/22 scenariusze lokalne PASS w Playwright/Chromium: formularz, klawiatura, nawigacja, widoki 390/1366 px, sygnały i adapter zgód. Próby na wdrożeniu [data i zakres] |
| Numer finalnej wersji GTM | [numer opublikowanej wersji, data i opis] |
| Usługa GA4 i strumień | [usługa, nazwa strumienia WWW i właściwy Measurement ID] |
| Źródło danych Meta | [nazwa źródła i Pixel ID] |
| Projekt Clarity | [nazwa projektu i Project ID] |
| CMP | Lokalna demonstracja ustawień, bez certyfikacji i bez transmisji. Docelowo Cookiebot przez GTM, Domain Group [uzupełnijcie] |
| Użyte narzędzia AI | Codex i OpenAI ImageGen. Własny wkład zespołu [uzupełnijcie] |

## 1. Brief i struktura LP

Fikcyjne czterogodzinne warsztaty jeździeckie w okolicach Krakowa, maksymalnie sześciu dorosłych w grupie, cena demonstracyjna 249 zł. Odbiorca chce zacząć jeździectwo i obawia się braku doświadczenia. Obietnica to stopniowe poznanie konia i próba jazdy przy wsparciu instruktora. Proponowane wejścia do prób to oznaczone linki z newslettera i Facebooka. CTA prowadzi do jednego formularza. Sukces wymaga niepustego imienia, prawidłowego formatu e-maila i wybranego doświadczenia. Po walidacji przycisk jest blokowany, a potwierdzenie informuje, że dane nie zostały wysłane.

Hero komunikuje cel, fakty pokazują logistykę, a program i FAQ odpowiadają na pytania przed formularzem. Dwa układy, teksty i makiety przygotowano retrospektywnie. [Brief](dokumentacja/brief.md) · [Struktura i makiety](dokumentacja/struktura-lp.md) · [Źródła grafik](dokumentacja/zrodla-materialow.md) · [Arkusze konkurencji](dokumentacja/analiza-konkurencji.md) i [drugiej pary](dokumentacja/testy-z-druga-para.md)

## 2. Decyzje dotyczące pracy z AI

| Obszar | Istotny fragment polecenia | Propozycja AI | Wasza decyzja i uzasadnienie | Sposób sprawdzenia i wynik |
| --- | --- | --- | --- | --- |
| Struktura lub treść | Porównaj dwa warianty LP | Porównanie obecnej kolejności z wcześniejszym FAQ | [decyzja i uzasadnienie] | CTA i szerokości potwierdzone lokalnie. Test z drugą parą NOT TESTED. |
| Budowa lub UX | Jawnie blokuj przycisk po sukcesie | `disabled` przed pokazaniem potwierdzenia oraz blokada kolejnych prób w dokumencie | [decyzja i uzasadnienie] | F08/A05/A06, jeden sukces i przycisk disabled. |
| Pomiar lub diagnostyka | Przygotuj `workshop_program_summary`, 50%/2000 ms | Użyć istniejącego podsumowania i reguły GTM | [decyzja i uzasadnienie] | A03 potwierdza geometrię 390/1366. Uruchomienie reguły G02 NOT TESTED. |

Przykład zmienionej propozycji AI: lokalny timer widoczności z wcześniejszej wersji zastąpiono regułą Element Visibility zgodnie z instrukcją 03. Własna ocena, uzasadnienie i wkład każdego autora **[do wpisania]**. [Dziennik decyzji](dokumentacja/decyzje-ai.md)

## 3. Słownik zdarzeń

| Zachowanie | Sygnał źródłowy lub reguła GTM | GA4 | Meta | Parametry i częstotliwość |
| --- | --- | --- | --- | --- |
| Wyświetlenie LP | `cookie_consent_update`, odpowiedni tag bazowy | `page_view` automatycznie | `PageView` | Adres LP i UTM w GA4, raz na stronę na dostawcę po zgodzie |
| Kliknięcie CTA | `cta_click` | `cta_click` | — | `cta_location`, raz na rzeczywiste kliknięcie |
| Widoczność oferty | Element Visibility, ID `workshop_program_summary` | `section_view` | — | `section_id`, 50% przez 2000 ms czasu kwalifikowanego, raz na stronę |
| Rozpoczęcie | `form_start` | `form_start` | — | `form_id`, pierwsza zmiana pola, raz na dokument |
| Sukces demonstracji | `lead_success` | `generate_lead` | `Lead` | `form_id` w kolejce i GA4; jeden sygnał na dokument, Meta bez wartości pól |

Do utworzenia w GA4 zdarzenie kluczowe `generate_lead` z metodą raz na zdarzenie i trzy wymiary Event `cta_location`, `form_id`, `section_id`. Status platformowy **NOT TESTED**. [Specyfikacja zdarzeń](dokumentacja/specyfikacja-zdarzen.md) · [Przewodnik GTM](gtm/configuration-guide.md)

## 4. Testy strony i pomiaru

| Scenariusz | Oczekiwany wynik | Rzeczywisty wynik i status | Dowód | Poprawka i ponowny test |
| --- | --- | --- | --- | --- |
| CTA w różnych miejscach | Ten sam formularz, różna lokalizacja | PASS lokalnie | F02/A02 | Porównanie parametrów po zmianie kontraktu zaliczone |
| Krótka i długa widoczność | Krótka 0, pełny próg jeden `section_view` | Geometria PASS; reguła NOT TESTED | A03-390, A03-1366, docelowo G02 | Zmniejszono cel do podsumowania; 100% możliwe w obu oknach |
| Błędny formularz | 0 sukcesów, start dopiero po edycji | PASS lokalnie, odbiór NOT TESTED | F07/A04, docelowo G03 | Usunięto start przy submit. Puste i błędne dane sprawdzono. |
| Poprawny formularz | Jeden sukces w obu usługach przy właściwych zgodach | Jeden lokalny `lead_success`; platformy NOT TESTED | F08/A05/A06, docelowo G04 | Oficjalny komunikat i mapowanie opisane |
| Podwójne kliknięcie | Jeden sukces i blokada przycisku | PASS lokalnie | F08/A05/A06 | Jawna blokada potwierdzona |
| 390 px i 1366 px, klawiatura | Czytelny układ i obsługiwalny formularz | PASS lokalnie | F04, F05/F06 | Przebieg na czterech szerokościach, oba widoki wymagane zaliczone |
| Poza Preview | Finalne tagi działają i można je zweryfikować | [uzupełnijcie] · NOT TESTED | P01, G05 | [uzupełnijcie] |

[Bieżący plan i wyniki](dokumentacja/plan-testow.md) · [Dowody i ograniczenia](dowody/README.md) · [Historia v1](dowody/historia/v1/README.md)

### Zgody

| Scenariusz | GA4 | Meta | Clarity | Dowód z GTM i Network |
| --- | --- | --- | --- | --- |
| Brak wyboru | Blokada | Blokada | Blokada | E01 · NOT TESTED |
| Odmowa wszystkich | Blokada | Blokada | Blokada | E02 · NOT TESTED |
| Tylko analityka | Działa | Blokada | Działa, reklama denied | E03 · NOT TESTED |
| Tylko marketing | Blokada | Działa | Blokada | E04 · NOT TESTED |
| Obie kategorie | Działa | Działa | Działa | E05 · NOT TESTED |
| Cofnięcie obu i przeładowanie | Blokada | Blokada | Blokada | E08 · NOT TESTED |

To oczekiwane stany. Cofnięcie pojedynczych kategorii obejmują E06/E07. W trybie docelowym przycisk prywatności otwiera preferencje Cookiebot. Adapter wykrywa odebranie zgody, blokuje dalsze sygnały aplikacji na czas przeładowania i przechodzi do dokumentu z zapisanym wyborem. Lokalne próby z kontrolowanym API potwierdziły obsługę sygnału i jedno przeładowanie. [Pełna macierz zgód](dokumentacja/plan-testow.md#macierz-zgód-na-opublikowanym-lp)

## 5. Analiza GA4

Pytanie dla GA4: ilu obserwowanych użytkowników przechodzi kolejne kroki? Okres i strefa **[uzupełnijcie]**, URL **[uzupełnijcie]**, populacja: aktywni użytkownicy kwalifikującego się LP z pomiarem analitycznym. Ustawienie: lejek zamknięty, przejścia pośrednie, warunek LP w krokach i maksymalnie 30 minut między krokami. Jednostką jest użytkownik raportowany przez GA4. Lejek może objąć różne sesje.

| Krok | Użytkownicy | Przejście z poprzedniego kroku |
| --- | --- | --- |
| `page_view` | N1 [wynik] | — |
| `form_start` | N2 [wynik] | N2/N1 [wynik] |
| `generate_lead` | N3 [wynik] | N3/N2 [wynik] |

Ukończenie N3/N1 **[wynik]**. Przy zerowym mianowniku „nie można obliczyć”.

| Lokalizacja CTA | Liczba zdarzeń kliknięcia |
| --- | --- |
| navigation | [wynik] |
| hero | [wynik] |
| bottom | [wynik] |

Eksploracja swobodna: `cta_location`, Event count, filtr `event_name=cta_click` i zakres LP. Kliknięcia opisują wolumen interakcji. Ich skuteczność względem ekspozycji wymaga pomiaru ekspozycji. [Dwa linki UTM, sześć prób, definicje i interpretacja](dokumentacja/analiza-danych.md). Sześć prób to liczba działań testowych. Liczbę sesji, użytkowników i zdarzeń ustala się oddzielnie z raportu. **Status NOT TESTED**.

## 6. Meta i remarketing

Pytanie dla Meta: kto spełnia regułę ponownego dotarcia i kto powinien być wykluczony? Dowód odbioru PageView i Lead we właściwym źródle **[uzupełnijcie]**, status **NOT TESTED**.

| Element grupy | Konfiguracja |
| --- | --- |
| Źródło | [rzeczywiste źródło Web EquiSoul] |
| Włączenie | Odwiedzający własny LP, [URL i warianty ścieżki] |
| Okres włączenia | 30 dni |
| Wykluczenie | Lead dotyczący EquiSoul z właściwego źródła i zakresu LP |
| Okres wykluczenia | 30 dni |
| Nazwa | EquiSoul · LP 30 dni bez Lead 30 dni, lub [nazwy dwóch grup] |
| Status i dowód | NOT TESTED · [zrzut reguły i odbioru] |

Wykluczenie ogranicza ponowną zachętę po zaobserwowanym sukcesie. Zespół wybiera i redaguje jeden z dwóch komunikatów **[wybór i obiekcja]**. [Reguły i teksty](dokumentacja/remarketing.md)

## 7. Clarity i obserwacja UX

Pytanie dla Clarity: jakie zachowanie może wskazywać problem w drodze do formularza? Dowód instalacji szablonu Official, stanu zgód i maskowania Strict **[uzupełnijcie]**. Źródło obserwacji **[własny LP / oficjalne demo Clarity]**. Jeśli korzystacie z demo, oznaczcie je jako przykład spoza projektu. Próba na własnym LP **[czas i strefa, URL, urządzenie, liczba sesji]**. Obserwacja **[fakt z nagrania lub mapy]**, hipoteza **[wyjaśnienie]**, alternatywa **[inne wyjaśnienie]**. Poprawka i sprawdzenie efektu **[test i miara]**. **Status NOT TESTED**.

Własne nagranie pokazuje ścieżkę i działania, z których można sformułować hipotezę UX. Wartości GA4, Meta i Clarity mogą różnić się z powodu zgód, sposobu rozpoznawania użytkowników, blokad i czasu przetwarzania. [Weryfikacja Clarity](gtm/configuration-guide.md#4-meta-i-clarity)

## 8. Wnioski i kompletność

| Obserwacja oparta na dowodzie | Hipoteza | Alternatywa | Następne sprawdzenie i miara |
| --- | --- | --- | --- |
| Lokalnie podsumowanie ma 265 px przy oknie 670 px i jest w pełni widoczne | Mniejszy blok umożliwia osiągnięcie progu na telefonie | Na wynik wpływa położenie w oknie i przebieg przewijania | G02 na publicznym LP. Sprawdź Percent Visible, On-Screen Duration i jedno odebrane `section_view`. |
| [obserwacja z GA4 lub Clarity] | [uzupełnijcie] | [uzupełnijcie] | [uzupełnijcie] |

Wyniki demonstracyjne opisują próby i działanie implementacji. Do wniosków o ofercie potrzebny byłby odrębny ruch i pomiar odbiorców. Populację analizy ograniczają zgody, filtry, narzędzia i czas. Braki: publiczny URL bieżącej wersji, identyfikatory i wdrożenia, wersja oraz eksport GTM, dowody pomiaru i odmowy, dane sześciu prób i testy z drugą parą. Podział pracy oraz wkład obu osób **[budował, sprawdzał, zamiana ról, daty]**. [Audyt](dokumentacja/audyt-rewizji.md) · [Macierz zgodności](dokumentacja/macierz-zgodnosci.md) · [Brakujące dowody](dowody/README.md#brakujące-dowody--not-tested)

### Lista plików

- [x] Pliki strony i zasoby w `strona/`.
- [x] Raport, macierz, dokumentacja, indeks oraz podpisane dowody lokalne.
- [x] Historia poprzedniego przebiegu; brak kluczy i danych dostępowych w paczce.
- [ ] Publiczny adres bieżącego LP i dowód testu poza Preview.
- [ ] Eksport właściwej opublikowanej wersji w `gtm/container-published.json`.
- [ ] Podpisane dowody platformowe i rzeczywiste wyniki drugiej pary.
