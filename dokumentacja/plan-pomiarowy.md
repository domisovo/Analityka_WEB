# Plan pomiarowy

Uzupełnienie retrospektywne planu ze spotkania 1. Główny wynik to ukończenie demonstracji po walidacji, a populacje GA4 i Meta zależą od odrębnych zgód.

| Pytanie | Obserwowane zachowanie | Zdarzenie GA4 | Potrzebny parametr |
| --- | --- | --- | --- |
| Czy LP został wyświetlony? | Google tag uruchomił się po zgodzie analitycznej | `page_view` | Wbudowany adres strony `page_location`, z wejściowym UTM |
| Z którego miejsca użytkownik przechodzi do formularza? | Kliknięcie głównego CTA | `cta_click` | `cta_location` |
| Czy podsumowanie oferty znalazło się na ekranie? | Element Visibility, 50% i 2000 ms, raz na stronę | `section_view` | `section_id=workshop_program_summary` |
| Czy użytkownik zaczął formularz? | Pierwsza faktyczna zmiana wartości pola | `form_start` | `form_id` |
| Czy poprawnie zakończył demonstrację? | Walidacja i komunikat z `lead_success` | `generate_lead` | `form_id` |

Dodatkowe pytanie do decyzji zespołu: które pytanie FAQ jest najczęściej rozwijane? Wymagałoby zdarzenia otwarcia oraz parametru identyfikatora pytania. Nie jest wdrożone.

**Bazowy lejek** `page_view → form_start → generate_lead`. Użytkownik może dotrzeć do formularza przewijaniem, więc CTA stanowi analizę dodatkową. Widoczność podsumowania jest miarą obecności elementu w oknie. Clarity może pokazać przebieg i miejsca trudności, a motywację należy badać inną metodą. [Specyfikacja](specyfikacja-zdarzen.md)
