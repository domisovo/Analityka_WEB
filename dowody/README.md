# Dowody bieżącej rewizji

[Wyniki przeglądarkowe JSON](wyniki-lokalne.json) pochodzą z Chromium z pustymi identyfikatorami usług. Próby CMP używają kontrolowanego interfejsu w przeglądarce. [Historia poprzedniej wersji](historia/v1/README.md) jest osobna.

| Dowód | Co potwierdza | Ograniczenie |
| --- | --- | --- |
| [Desktop 1366 px](lp/desktop.png) | Nawigacja, hero i CTA | Zrzut jednego stanu lokalnego |
| [Telefon 390 px](lp/mobile.png) | Widok mobilny i zamknięte menu | Emulacja Chromium |
| [Błędny formularz](formularz/negatywny.png) | Widoczny komunikat i stan błędu | Brak sukcesu potwierdza lokalny log F07/A04 |
| [Sukces](formularz/sukces.png) | Komunikat wg instrukcji | Blokadę, deduplikację i brak danych w kolejce potwierdza F08/A05/A06. Odbiór wymaga wdrożenia. |
| [Ustawienia](zgody/zmiana-wyboru.png) | Niezależne kontrolki lokalnego panelu | Próba Z06 bez Cookiebot i wykonania tagów |
| [Wyniki](wyniki-lokalne.json) | Rzeczywisty przebieg lokalny, w tym adapter, geometria i brak ręcznej emisji | Nie potwierdza odbioru GA4, Meta i Clarity |

## Brakujące dowody · NOT TESTED

| Zakres | Dowód do zebrania | Co pozwoli stwierdzić |
| --- | --- | --- |
| Projektowanie i budowa | Arkusze testu makiety i LP z drugą parą, zmiana i powtórzenie, decyzje AI obu studentów | Zrozumienie i zachowania w konkretnej próbie |
| Publikacja | Publiczny HTTPS i zrzuty 390/1366 px na wdrożeniu | Dostępność wersji w czasie próby |
| [GTM](gtm/README.md) | Preview, zdarzenie CMP, triggery, stan zgód, widoczność i końcowy eksport JSON | Uruchomienie tagów oraz zapisana konfiguracja |
| [GA4](ga4/README.md) | DebugView, odbiór `generate_lead` z parametrem, negatywny test, odmowa, eksploracje, Realtime i sześć prób | Odbiór i wyniki w populacji pomiarowej, bez wniosku o skuteczności biznesowej |
| [Meta](meta/README.md) | Test Events PageView/Lead, próby błędne i reguła grupy | Odbiór i zakres grupy, bez wniosku o jej skali |
| [Clarity](clarity/README.md) | Oficjalny tag, `metadata`, Strict, zamaskowane nagranie i mapy | Instalacja i obserwowane zachowanie, bez wniosku o motywacji |
| Zgody | Preview i Network dla E01–E08, osobno przypadki po przeładowaniu | Blokowanie transmisji i zgodność sygnałów w testowych profilach |

Dodajcie datę, scenariusz, URL, wersję, stan zgód, wynik i ograniczenie pod każdym dowodem. W publicznych materiałach pomińcie dane dostępu oraz identyfikatory prywatne.
