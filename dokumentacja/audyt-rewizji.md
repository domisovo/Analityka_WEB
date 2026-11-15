# Audyt aktualizacji istniejącego EquiSoul

Punkt wyjścia to pierwsza wersja EquiSoul. Porównanie wykonano na podstawie sześciu osobnych instrukcji. Szczegółowe nazwy sygnałów, mechanizmy i układ raportu przejęto ze spotkań oraz oficjalnego szablonu. Makiety, warianty, uzupełnienia briefu i audyt powstały po pierwszej implementacji.

| Instrukcja | Rozbieżność pierwszej wersji | Wynik rewizji |
| --- | --- | --- |
| 00 · Projekt i punktacja | Podstawowy LP lokalny, brak zewnętrznych dowodów i opublikowanego eksportu | Zachowano istniejącą stronę i opisano nierozstrzygnięte wymagania wdrożenia. |
| 01 · Projektowanie | Brief skrócony, jeden układ, brak dwóch makiet, trzech wariantów i arkuszy | Dodano retrospektywną dokumentację, porównania i miejsca na własne decyzje oraz próby. |
| 02 · Budowa | Lokalny sukces `generate_lead`, start przy pustej próbie, przycisk tylko ukrywany, inna treść potwierdzenia, szerokość desktop 1440 px | `lead_success`, start po faktycznej edycji, blokada i oficjalny komunikat. Testy 390/1366 px. |
| 03 · GTM i GA4 | Ręczne `page_view`, lokalna widoczność z progiem zależnym od ekranu, GTM za bramką i własna obsługa Consent Mode, brak sześciu prób | Google tag ma tworzyć odsłonę; widoczność w Element Visibility; rozłączne tryby; trzy wymiary, lejek bazowy, CTA i plan ruchu. |
| 04 · Meta i Clarity | Brak sekwencjonowania Meta, Clarity Custom HTML, jeden komunikat i brak końcowej tabeli według instrukcji | Sekwencja base/Lead, szablon Official z GCM i Strict, dwa komunikaty i macierz. |
| 05 · Raport | Układ 20 sekcji z wcześniejszego briefu | Dane projektu i osiem części z szablonu, wyniki, dowody i pola do uzupełnienia. |

Zmiany wprowadzono w istniejących plikach HTML i JS oraz dokumentacji. Dotychczasowe CSS, grafiki, układ i treść oferty zachowano. Zmieniono wyłącznie komunikat demonstracyjnego sukcesu i informacje o zgłaszaniu zgód. Poprzednie testy, log i zrzuty są w [historii v1](../dowody/historia/v1/README.md). [Macierz](macierz-zgodnosci.md)
