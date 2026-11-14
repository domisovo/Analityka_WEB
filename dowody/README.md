# Indeks dowodów

Testy lokalne wykonano 14.11.2026 w Chromium. Narzędzie testowe użyło pustego pola GTM. [Rzeczywiste wyniki z datą i wersją przeglądarki](wyniki-lokalne.json)

| Dowód | Co pokazuje | Granica interpretacji |
| --- | --- | --- |
| [Desktop](lp/desktop.png) | Nawigację, hero, CTA i pasek faktów w 1440 px | Jeden widok lokalny po odmowie. |
| [Telefon](lp/mobile.png) | Ułożenie hero i zamknięte menu w 390 px | Jeden rozmiar w emulacji Chromium. |
| [Błędny e-mail](formularz/negatywny.png) | Czytelny błąd lokalny przy próbie zatwierdzenia | Brak lokalnego `generate_lead` jest zapisany w teście F07/A04. Zrzut nie potwierdza zachowania dostawców. |
| [Poprawna próba](formularz/sukces.png) | Wyświetlenie potwierdzenia po walidacji | Jeden lokalny lead potwierdza F08/A05/A06. Brak potwierdzenia odbioru GA4 i Meta. |
| [Zmiana zgód](zgody/zmiana-wyboru.png) | Niezależne kontrolki przed zapisaniem zmiany | Przeładowanie i odczyt wybranego stanu są w teście Z06. Brak działającego kontenera. |
| [JSON testów](wyniki-lokalne.json) | Wyniki automatycznych testów strony, logiki i lokalnej kolejki przy pustym ID GTM | Scenariusze lokalne. Zakres nie obejmuje faktycznego odbioru platform, liczebności grupy ani skuteczności oferty. |

## Do uzupełnienia po konfiguracji

| Katalog | Potrzebny dowód | Granica interpretacji |
| --- | --- | --- |
| `lp/` | Publiczny URL HTTPS, pomyślny deployment i widok publiczny | Dostępność konkretnej wersji w czasie testu. |
| [gtm](gtm/README.md) | Preview zdarzeń, wartości zmiennych i stany zgód, wersja opublikowana | Preview sprawdza uruchomienie i parametry tagów. Odbiór sprawdzają widoki dostawców. |
| [ga4](ga4/README.md) | DebugView, oznaczenie zdarzenia kluczowego, lejki i tabela CTA | Pokazuje konfigurację i testy dla mierzonej populacji. |
| [meta](meta/README.md) | Test Events i reguły odbiorców | Odbiór testowy i konfiguracja. Liczebność i efekt kampanii poza zakresem. |
| [clarity](clarity/README.md) | Weryfikacja instalacji, zamaskowane nagranie i dwie mapy | Można ocenić zdarzenia z tej sesji i przykładowe zachowania. |
| `zgody/` | Zakładka Consent w GTM oraz Network dla każdego wariantu i po wycofaniu | Obserwacja żądań w konkretnych profilach testowych. |

Dla każdego dodanego dowodu podajcie datę, adres, wersję opublikowaną, warunki zgód i ID testu. Zapiszcie oczekiwany i rzeczywisty wynik. Zanonimizujcie dane dostępu i identyfikatory użytkowników testowych.
