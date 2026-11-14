# Plan testów i wyniki

Wyniki lokalne z 14.11.2026 pochodzą z Playwright i Chromium. Uruchamiajcie scenariusze w świeżych profilach na fikcyjnych danych. [Raport maszynowy](../dowody/wyniki-lokalne.json) zawiera wersję przeglądarki, dokładny czas i wynik każdej grupy. Identyfikatory połączone w logu wskazują wspólne wykonanie. Każdy scenariusz lokalny sprawdza też brak zewnętrznych żądań, prób wysłania i błędów JS w konfiguracji bez ID GTM.

## Testy lokalne

| ID | Warunek początkowy | Kroki | Oczekiwane | Rzeczywiste | Status | Dowód i ograniczenie |
| --- | --- | --- | --- | --- | --- | --- |
| F01 | Desktop, odmowa | Otwórz Program, Organizacja, FAQ i Prywatność | Właściwe cele, strona prywatności bez pomiaru | Trzy hashe i podstrona prawidłowe | PASS | JSON F01. Lokalny serwer. |
| F02 | Desktop, analityka | Użyj każdego z trzech CTA | Ten sam formularz i fokus na jego nagłówku | Prawidłowe cele i fokus | PASS | JSON F02/A02. Test jednego silnika. |
| F03 | Odmowa | Otwórz spacją i zamknij Enterem każde pytanie | Widoczne odpowiedzi i działające zwijanie | Zmienił się stan wszystkich siedmiu pytań | PASS | JSON F03. Klawiatura Chromium. |
| F04 | Odmowa, cztery rozmiary | Zmień szerokość na 320/390/768/1440. Enter otwiera menu, Escape zamyka | Brak przewijania poziomego, powrót fokusu | Zgodne we wszystkich szerokościach | PASS | JSON F04, [zrzut mobilny](../dowody/lp/mobile.png). Emulacja. |
| F05 | Odmowa, bez myszy | Enter na hero, Tab po polach, wybierz opcję i wyślij Enterem | Poprawna kolejność i fokus na sukcesie | Formularz ukończony i fokus ustawiony | PASS | JSON F05/F06. Bez audytu czytnika ekranu. |
| F06 | Odmowa | Podaj fikcyjne imię, poprawny e-mail i doświadczenie | Sukces, czyste pola, brak leada analitycznego | Potwierdzono sukces, czyste pola i zero leadów | PASS | JSON F05/F06. Dotyczy lokalnego stanu. |
| F07 | Zgoda analityczna | Wyślij puste pola, następnie błędny e-mail | Błędy i fokus, brak sukcesu | Trzy błędy dla pustego formularza, błąd e-maila, zero sukcesu | PASS | JSON F07/A04 i [zrzut błędu](../dowody/formularz/negatywny.png). |
| F08 | Obie zgody | Wypełnij i kliknij przycisk dwukrotnie | Jeden stan sukcesu | Jeden sukces oraz jeden wpis leada | PASS | JSON F08/A05/A06 i [zrzut sukcesu](../dowody/formularz/sukces.png). Dotyczy jednego dokumentu. |
| A01 | URL z query i hash | Przyznaj analitykę, użyj CTA, odśwież stronę | Jedna odsłona na dokument, URL bez query i hash | Jeden wpis z oczekiwanymi wartościami | PASS | JSON A01. Nie sprawdza automatycznych hitów Google tag. |
| A02 | Analityka | Kliknij trzy główne CTA | Trzy wartości id i lokalizacji, wspólna treść CTA | Zgodna kolejność i komplet parametrów | PASS | JSON F02/A02. Warstwa lokalna. |
| A03 | Analityka, 390×670 i 1440×900 | Wejdź w sekcję na 300 ms, wyjdź, wróć na ponad sekundę, wejdź ponownie | Pierwszy krótki widok pominięty, potem pojedyncze zdarzenie | Zgodne przy proporcjach 1070/670 i 742/900 px | PASS | JSON A03-390/1440. Czas i geometria, bez pomiaru uwagi. |
| A04 | Analityka | Ustaw fokus na polu, spróbuj wysłać pusty formularz, edytuj i powtórz | Fokus sam nie mierzy, jedna próba po interakcji | 0 po fokusie, 1 po interakcji | PASS | JSON F07/A04. Automatyczne zdarzenia GA4 sprawdzi G02. |
| A05 | Obie zgody | Wypełnij i wyślij poprawnie; osobno powtórz scenariusz błędny F07 | Lead po sukcesie w poprawnej próbie, brak po błędzie | Jedna pełna sekwencja i zero leadów przy błędach | PASS | JSON F08/A05/A06 i F07/A04. Odbiór osobno. |
| A06 | Obie zgody | Użyj wyróżniających danych fikcyjnych, zapisz i kliknij dwukrotnie | Brak powtórzeń, brak danych w dataLayer, URL i pamięci | Wartości wejściowe nie występują w kontrolowanych miejscach | PASS | JSON F08/A05/A06. Hity dostawców wymagają rzeczywistej instalacji. |
| Z01 | Bez decyzji | Otwórz stronę, pozostaw baner | Domyślne false/false i brak pomiaru | Stan false/false, brak żądań zewnętrznych | PASS | JSON Z01/Z02. Bez skonfigurowanego ID. |
| Z02 | Brak decyzji | Odrzuć i przeładuj | Brak banera i zdarzeń biznesowych | Zapamiętana odmowa, 0 zdarzeń | PASS | JSON Z01/Z02. Bez skonfigurowanego ID. |
| Z03 | Brak decyzji | Wybierz tylko analitykę, odśwież, ukończ | Jedna lokalna odsłona GA4, gotowość analityki, jeden lead, brak gotowości Meta | Stan i kolejka zgodne | PASS | JSON Z03. Warstwa lokalna. |
| Z04 | Brak decyzji | Wybierz tylko marketing, odśwież, ukończ | Gotowość Meta, jeden wspólny lead, 0 odsłon GA4 i startów | Stan i kolejka zgodne | PASS | JSON Z04. Warstwa lokalna. |
| Z05 | Brak decyzji | Akceptuj wszystko, odśwież, ukończ | Obie gotowości, jeden wspólny lead | Potwierdzono oba sygnały i jeden lead | PASS | JSON Z05. Warstwa lokalna. |
| Z06 | Obie zgody zapisane | Odznacz analitykę, potem odrzuć marketing | Dwa przeładowania i odpowiedni stan po każdym | Przeładowania i stan zgodne | PASS | JSON Z06 i [zrzut ustawień](../dowody/zgody/zmiana-wyboru.png). Bez bibliotek dostawców. |
| Z07 | Odmowa | Kliknij CTA, ukończ, następnie akceptuj wszystko | Pomiar bieżącego widoku i zero odtworzonych działań | Jedna odsłona, zero historycznych zdarzeń | PASS | JSON Z07. Warstwa lokalna. |
| Z08 | Dwie karty przy obu zgodach | Odrzuć w pierwszej karcie | Druga przeładuje się z odmową | Druga karta nie dodała sygnałów pomiaru | PASS | JSON Z08. Jeden profil Chromium. |
| Z09 | Zapisane zgody, wymuszony błąd zapisu | Odrzuć i poczekaj na nawigację | Nowy dokument odmawia pomiaru | Brak gotowości tagów, stary zapis usunięty w teście | PASS | JSON Z09. Test wymusza błąd `setItem`, przy działającym `removeItem`. |
| A07 | Tylko analityka, bez kliknięcia CTA | Przewiń do formularza, przejdź poprawną próbę | Odsłona, start i lead, brak CTA | Kolejka ma oczekiwaną sekwencję | PASS | JSON A07. Warstwa lokalna. |

## Testy na opublikowanej stronie

Każdy poniższy test czeka na rzeczywisty HTTPS, kontener oraz usługę wymienioną w warunkach. Po wykonaniu wpiszcie faktyczny wynik, status i ścieżkę do dowodu. Dla testów sieci otwórzcie DevTools → Network przed wejściem na stronę, włączcie Preserve log i wyczyśćcie dane witryny przed każdym wariantem. Sprawdzajcie hosty Google Tag Manager i Google Analytics, `connect.facebook.net`, żądania Pixela do Facebooka oraz `*.clarity.ms`. Przy odmowie zweryfikujcie również próbę poza Preview. Sygnałów samego narzędzia debugującego nie liczcie jako hitów LP. Eksporty HAR mogą zawierać informacje techniczne przeglądarki. Do oddania wybierzcie zanonimizowane fragmenty.

| ID | Warunek początkowy | Kroki | Oczekiwane | Rzeczywiste | Status | Miejsce na dowód i ograniczenie |
| --- | --- | --- | --- | --- | --- | --- |
| G00 | Wdrożenie Pages | Otwórz URL na telefonie i desktopie, sprawdź zasoby, kotwice, prywatność | HTTPS, pełny render, obsługa interakcji | [uzupełnij] | NOT TESTED | `dowody/lp/`. Konkretny moment i wersja. |
| G01 | GTM z tagami, Preview, zgody zgodnie ze zdarzeniami | Wykonaj sekwencję CTA–program–formularz oraz negatywny formularz | Poprawna kolejność i parametry, brak tagów leada po błędzie | [uzupełnij] | NOT TESTED | `dowody/gtm/`. Wyzwolenie tagów nie potwierdza odbioru. |
| G02 | GA4, Preview, wyłączony Enhanced Measurement | Włącz analitykę, kliknij kilka CTA, pokaż program, wpisz błąd, następnie zakończ | 5 nazw zdarzeń w DebugView, po jednej odsłonie i konwersji, start bez duplikacji, brak treści pól | [uzupełnij] | NOT TESTED | `dowody/ga4/`. Odbiór tej sesji debug. |
| G03 | Usługa GA4 z testowymi danymi | Sprawdź wymiary, zdarzenie kluczowe, oba lejki, widoczność i tabelę CTA | Zgodne definicje i widoczna konfiguracja eksploracji | [uzupełnij] | NOT TESTED | `dowody/ga4/`. Ruch testowy nie określa skuteczności. |
| E01 | Instalacja, zgody usunięte | Wejdź bez wyboru, potem odrzuć, odśwież i ukończ formularz | Brak GTM i wszystkich hitów, demonstracyjny sukces | [uzupełnij] | NOT TESTED | `dowody/zgody/`. Obserwowane żądania i cookies w testowym profilu. |
| E02 | Świeży profil | Wybierz tylko analitykę, odśwież, ukończ | GA4 i Clarity działają, brak Meta | [uzupełnij] | NOT TESTED | `dowody/zgody/`. Network i zgody w Preview. |
| E03 | Świeży profil | Wybierz tylko marketing, odśwież, ukończ | Meta PageView/Lead, brak GA4 i Clarity | [uzupełnij] | NOT TESTED | `dowody/zgody/`. Network i zgody w Preview. |
| E04 | Świeży profil | Akceptuj wszystko, odśwież, ukończ, sprawdź ładunki | Wszystkie narzędzia uruchomione, jeden lead po stronie każdego odbiorcy, brak wartości pól | [uzupełnij] | NOT TESTED | `dowody/zgody/`. Dane testowe w DevTools. |
| E05 | Wszystkie narzędzia uruchomione | Wycofaj tylko analitykę, po przeładowaniu wykonaj działania i sprawdź hity; powtórz dla marketingu w osobnej próbie, potem odrzuć oba | Nowy dokument utrzymuje pozostałą kategorię i blokuje odwołane tagi. Zanotuj oddzielnie ewentualne żądania rozpoczęte przed zmianą lub kończące stary dokument | [uzupełnij] | NOT TESTED | `dowody/zgody/`. Network w oknie przeładowania i po nim. |
| G06 | Zaliczone testy, uprawnienia do GTM | Opublikuj, sprawdź Versions, pobierz JSON, wykonaj test poza Preview | JSON z opublikowanej wersji i pozytywna weryfikacja | [uzupełnij] | NOT TESTED | `gtm/container-published.json` oraz `dowody/gtm/`. Zgodność z wersją w chwili eksportu. |
| M01 | Prawdziwy Pixel, Events Manager | Przy samym marketingu sprawdź PageView, puste i błędne pola oraz poprawny formularz z dwuklikiem | Jedno PageView, zero negatywnych Lead, jeden poprawny Lead | [uzupełnij] | NOT TESTED | `dowody/meta/`. Test Events i Diagnostics. |
| M02 | Dostęp do Audiences | Utwórz grupę LP 30 dni, wyklucz Lead 30 dni | Właściwe źródło, ścieżka i wykluczenie | [uzupełnij] | NOT TESTED | `dowody/meta/`. Reguły nie określają skali grupy. |
| C01 | Clarity, Strict masking | Uruchom z analityką, wypełnij próbę, sprawdź odbiór i nagranie | Nagranie dostępne, wartości pól i obszar formularza zamaskowane | [uzupełnij] | NOT TESTED | `dowody/clarity/`. Nagranie danej próby. |
| C02 | Dostępne nagrania, ruch próbny na LP | Otwórz mapy kliknięć i przewijania, rozbij urządzenia | Mapy konkretnego URL i jedna obserwacja z warunkiem weryfikacji | [uzupełnij] | NOT TESTED | `dowody/clarity/`. Mała próba może ograniczyć interpretację. |
