# Plan analizy danych

## Populacja

Analizujcie okno **[od – do, strefa raportowania GA4]**. Filtr dotyczy wyłącznie ścieżek LP z tej samej domeny, łącznie z ewentualnym `index.html`. Użyjcie jednej usługi GA4 dla projektu i oddzielcie ruch weryfikacyjny od późniejszej obserwacji. Zapiszcie, czy zakres obejmuje testy. Dane testowe odpowiadają na pytanie o działanie pomiaru.

Jednostką lejków jest aktywny użytkownik raportowany przez Funnel Exploration, w swoim pierwszym kwalifikującym przejściu w okresie. Widziane zdarzenia należą do pomiaru za zgodą analityczną, a ich obserwowalność ograniczają także blokady, zmiany urządzenia i zgody, progi raportowania oraz konfiguracja strumienia. „Użytkownik” to jednostka rozpoznawana przez GA4. Dla wolumenów używajcie tej samej metryki aktywnych użytkowników i tych samych filtrów, z warunkami zdarzeń z tabeli. Zapiszcie mianownik policzony jednolicie w każdej eksploracji. [Lejek GA4](https://support.google.com/analytics/answer/9327974)

## Lejki

W **Explore → Funnel exploration** utwórzcie zamknięte lejki. Ustawcie dla kolejnych kroków **indirectly followed by** z oknem maksymalnie 30 minut między krokami jako umowną granicą analizy. Ten warunek nie wymusza wspólnej sesji. W kroku wejścia filtrujcie `page_location` po ścieżce publicznego LP. Dla kroków formularza filtrujcie `form_id = workshop_interest_form`.

- **Ścieżka przez CTA** — `page_view → cta_click → form_start → generate_lead`. W kroku CTA uwzględnijcie trzy wartości `cta_id`. Pokażcie odpływ między krokami i przekrój Device category. Kliknięcie pozwala przypisać krok lejka, ale samo nie dowodzi wpływu CTA na decyzję.
- **Ścieżka formularza** — `page_view → form_start → generate_lead`. Obejmuje dotarcie przez CTA i przewijanie. Porównanie wolumenów obu lejków nie tworzy dokładnej grupy „bez CTA”, ponieważ GA4 może agregować różne ścieżki tego samego użytkownika.
- **Widoczność programu** — `page_view → section_view` z `section_id = workshop_program`. Program ma osobną analizę i nie jest warunkiem w dwóch lejkach konwersji.

Zapiszcie kroki, daty, urządzenia i ewentualne progi danych. Porównajcie mobile i desktop przy tym samym zakresie dat, regułach i mianownikach. Device category w rozbiciu lejka odpowiada urządzeniu wejścia do lejka.

## Miary

W zapisie poniżej `V`, `S`, `L` oznaczają aktywnych użytkowników kolejnych kroków lejka formularza, a `P` aktywnych użytkowników drugiego kroku lejka programu. Obszar to zawsze ten sam LP.

| Wskaźnik | Licznik | Mianownik | Jednostka i populacja | Ograniczenie |
| --- | --- | --- | --- | --- |
| Odwiedzający | V | — | Aktywni użytkownicy wejścia, zgoda analityczna | Brak osób bez zarejestrowanej odsłony. |
| Widzący program | P | — | Aktywni użytkownicy lejka programu | Warunek geometrii w oknie widoku. |
| Rozpoczynający formularz | S | — | Aktywni użytkownicy lejka formularza, po wejściu | Pierwsza interakcja lub próba zatwierdzenia. |
| Kończący formularz | L | — | Aktywni użytkownicy po starcie w lejku | Wynik demonstracji. DebugView i osobna tabela `generate_lead` pozwalają zauważyć zdarzenia bez zmierzonego startu. |
| Konwersja | L | V | % użytkowników wejścia lejka formularza | Ukończenie widoczne tylko dla osób spełniających kroki i okno. |
| Rozpoczęcie | S | V | % użytkowników wejścia lejka formularza | Start sprzed zgody może być pominięty. |
| Ukończenie | L | S | % użytkowników startu lejka formularza | Powroty poza oknem przyjętym w analizie mogą stanowić osobne przypadki. |
| Porzucenie | S − L | S | % użytkowników startu lejka formularza | Oznacza brak obserwowanego ukończenia w przyjętym oknie. |
| Widoczność | P | V | % użytkowników wejścia lejka programu | Próg mobilny dotyczy połowy krótszej z dwóch wysokości. |
| Kliknięcia danego CTA | Event count dla cta_click z jego cta_id | — | Liczba zdarzeń w populacji analitycznej | Ten sam użytkownik może kliknąć wielokrotnie. |
| Klikający dane CTA | Active users z takim cta_click | — | Aktywni użytkownicy w populacji analitycznej | Jeden użytkownik może wystąpić w wielu wierszach. |

Przy zerowym mianowniku oznaczcie wynik kreską. W **Explore → Free form** ustawcie wiersze `cta_id` (opcjonalnie `cta_location`), wartości **Event count** i **Active users** oraz filtr Event name = cta_click na LP. Zestawienie porządkuje się według liczby kliknięć. Ekspozycja CTA nie jest mierzona, więc tabela pokazuje wolumen, a nie CTR.

Do raportu wpiszcie: **[okres]**, **[kroki i liczebności]**, **[mianowniki]**, **[podział urządzeń]**, **[obserwacja]**, **[ograniczenie]**. Gdy pomiar wykaże większy odpływ mobilny na etapie start–sukces, sprawdźcie w zamaskowanych nagraniach dostępność pól przy otwartej klawiaturze i komunikaty błędów. Zweryfikujcie hipotezę w powtarzalnym teście zadaniowym. Brak danych platformowych pozostawia rekomendację warunkową.
