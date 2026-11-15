# Plan analizy danych

## Populacja

Analizujcie okno **[od – do, strefa raportowania GA4]**. Filtr dotyczy wyłącznie ścieżek LP z tej samej domeny, łącznie z ewentualnym `index.html`. Użyjcie jednej usługi GA4 dla projektu i oddzielcie ruch weryfikacyjny od późniejszej obserwacji. Zapiszcie, czy zakres obejmuje testy. Dane testowe odpowiadają na pytanie o działanie pomiaru.

Jednostką lejków jest aktywny użytkownik raportowany przez Funnel Exploration, w swoim pierwszym kwalifikującym przejściu w okresie. Widziane zdarzenia należą do pomiaru za zgodą analityczną, a ich obserwowalność ograniczają także blokady, zmiany urządzenia i zgody, progi raportowania oraz konfiguracja strumienia. „Użytkownik” to jednostka rozpoznawana przez GA4. Dla wolumenów używajcie tej samej metryki aktywnych użytkowników i tych samych filtrów, z warunkami zdarzeń z tabeli. Zapiszcie mianownik policzony jednolicie w każdej eksploracji. [Lejek GA4](https://support.google.com/analytics/answer/9327974)

## Lejki

W **Explore → Funnel exploration** utwórzcie zamknięte lejki. Ustawcie dla kolejnych kroków **indirectly followed by** z oknem maksymalnie 30 minut między krokami jako umowną granicą analizy. Ten warunek nie wymusza wspólnej sesji. W kroku wejścia filtrujcie `page_location` po ścieżce publicznego LP. Dla kroków formularza filtrujcie `form_id = workshop_interest_form`.

- **Ścieżka formularza (bazowa)** — `page_view → form_start → generate_lead`. Obejmuje dotarcie przez CTA i przewijanie. Porównanie wolumenów obu lejków nie tworzy dokładnej grupy „bez CTA”, ponieważ GA4 może agregować różne ścieżki tego samego użytkownika.
- **Ścieżka przez CTA** — `page_view → cta_click → form_start → generate_lead`. W kroku CTA uwzględnijcie trzy wartości `cta_location`. Pokażcie odpływ między krokami i przekrój Device category. Kliknięcie pozwala przypisać krok lejka, ale samo nie dowodzi wpływu CTA na decyzję.
- **Widoczność programu** — `page_view → section_view` z `section_id = workshop_program_summary`. Program ma osobną analizę i nie jest warunkiem w dwóch lejkach konwersji.

Zapiszcie kroki, daty, urządzenia i ewentualne progi danych. Porównajcie mobile i desktop przy tym samym zakresie dat, regułach i mianownikach. Device category w rozbiciu lejka odpowiada urządzeniu wejścia do lejka.

## Miary

W zapisie poniżej `V`, `S`, `L` oznaczają aktywnych użytkowników kolejnych kroków lejka formularza, a `P` aktywnych użytkowników drugiego kroku lejka programu. Obszar to zawsze ten sam LP.

| Wskaźnik | Licznik | Mianownik | Jednostka i populacja | Ograniczenie |
| --- | --- | --- | --- | --- |
| Odwiedzający | V | — | Aktywni użytkownicy wejścia, zgoda analityczna | Brak osób bez zarejestrowanej odsłony. |
| Widzący program | P | — | Aktywni użytkownicy lejka programu | Warunek geometrii w oknie widoku. |
| Rozpoczynający formularz | S | — | Aktywni użytkownicy lejka formularza, po wejściu | Pierwsza rzeczywista zmiana wartości pola. |
| Kończący formularz | L | — | Aktywni użytkownicy po starcie w lejku | Wynik demonstracji. DebugView i osobna tabela `generate_lead` pozwalają zauważyć zdarzenia bez zmierzonego startu. |
| Konwersja | L | V | % użytkowników wejścia lejka formularza | Ukończenie widoczne tylko dla osób spełniających kroki i okno. |
| Rozpoczęcie | S | V | % użytkowników wejścia lejka formularza | Start sprzed zgody może być pominięty. |
| Ukończenie | L | S | % użytkowników startu lejka formularza | Powroty poza oknem przyjętym w analizie mogą stanowić osobne przypadki. |
| Porzucenie | S − L | S | % użytkowników startu lejka formularza | Oznacza brak obserwowanego ukończenia w przyjętym oknie. |
| Widoczność | P | V | % użytkowników wejścia lejka programu | 50% bloku podsumowania przez 2000 ms czasu kwalifikowanego w GTM. |
| Kliknięcia danego CTA | Event count dla cta_click z jego cta_location | — | Liczba zdarzeń w populacji analitycznej | Ten sam użytkownik może kliknąć wielokrotnie. |
| Klikający dane CTA | Active users z takim cta_click | — | Aktywni użytkownicy w populacji analitycznej | Jeden użytkownik może wystąpić w wielu wierszach. |

Przy zerowym mianowniku wpiszcie „nie można obliczyć”. W **Explore → Free form** ustawcie wiersze `cta_location`, wartość **Event count** i filtr Event name = cta_click na LP. Jeżeli chcecie policzyć także klikających, użyjcie osobnej metryki **Active users** z tym samym filtrem. Zestawienie porządkuje się według liczby kliknięć. Ekspozycja CTA nie jest mierzona, więc tabela pokazuje wolumen, a nie CTR.

Do raportu wpiszcie: **[okres]**, **[kroki i liczebności]**, **[mianowniki]**, **[podział urządzeń]**, **[obserwacja]**, **[ograniczenie]**. Gdy pomiar wykaże większy odpływ mobilny na etapie start–sukces, sprawdźcie w zamaskowanych nagraniach dostępność pól przy otwartej klawiaturze i komunikaty błędów. Zweryfikujcie hipotezę w powtarzalnym teście zadaniowym. Brak danych platformowych pozostawia rekomendację warunkową.

## Sześć prób po publikacji

Dwa przykładowe wejścia na ten sam LP. Zastąpcie `https://twoja-domena.example/oferta/` rzeczywistym adresem.

- `https://twoja-domena.example/oferta/?utm_source=newsletter&utm_medium=email&utm_campaign=projekt1_test`
- `https://twoja-domena.example/oferta/?utm_source=facebook&utm_medium=paid_social&utm_campaign=projekt1_test`

To oznaczenia wejść testowych. Nie umieszczajcie ich w wewnętrznych CTA. Bez UTM można wejść z czystego profilu przez ręczne wpisanie adresu. Zmiana oznaczeń w trakcie sesji nie wymusza nowej sesji. Użyjcie oddzielnych prób poza Preview. Dla pierwszych pięciu udzielcie zgody analitycznej. Zapiszcie czas, strefę, urządzenie, URL, wynik oraz dowód. Próby, użytkownicy, sesje i zdarzenia stanowią różne jednostki.

| ID | Link i wybór | Zadanie | Oczekiwane w GA4 | Rzeczywisty wynik, czas i plik | Status |
| --- | --- | --- | --- | --- | --- |
| U01 | Newsletter, analityka | CTA, edycja, sukces | Odsłona, CTA, start, lead | [uzupełnijcie] | NOT TESTED |
| U02 | Facebook, analityka | Przewiń bez CTA, edytuj i zakończ | Odsłona, start, lead, brak CTA | [uzupełnijcie] | NOT TESTED |
| U03 | Newsletter, analityka | Edytuj pole i wyjdź | Odsłona i start, brak leada | [uzupełnijcie] | NOT TESTED |
| U04 | Facebook, analityka | Wpisz błędny e-mail, spróbuj wysłać i wyjdź | Odsłona, start, brak leada | [uzupełnijcie] | NOT TESTED |
| U05 | Dowolny z dwóch, analityka | Obejrzyj LP bez edycji formularza | Odsłona, brak startu i leada | [uzupełnijcie] | NOT TESTED |
| U06 | Dowolny z dwóch, odrzuć opcjonalne | Kliknij CTA i ukończ demonstrację | Brak hitów GA4; dowód w Network | [uzupełnijcie] | NOT TESTED |

## Zapis wyników bazowego lejka

| Krok | Użytkownicy | Przejście od poprzedniego |
| --- | --- | --- |
| `page_view` | N1 [uzupełnijcie] | — |
| `form_start` | N2 [uzupełnijcie] | N2/N1 [uzupełnijcie] |
| `generate_lead` | N3 [uzupełnijcie] | N3/N2 [uzupełnijcie] |

Ukończenie całego lejka N3/N1 **[uzupełnijcie]**. Jeżeli dane jeszcze się przetwarzają, zapiszcie datę sprawdzenia i dowód konfiguracji. Nie wpisujcie wartości przewidywanych z planu prób w miejsce pomiaru.

| CTA | Liczba zdarzeń kliknięcia |
| --- | --- |
| navigation | [uzupełnijcie] |
| hero | [uzupełnijcie] |
| bottom | [uzupełnijcie] |

Obserwacja **[dowód i wynik]**. Hipoteza **[uzupełnijcie]**. Inne możliwe wyjaśnienie **[uzupełnijcie]**. Następny test i miara **[uzupełnijcie]**.
