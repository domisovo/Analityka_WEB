# Specyfikacja zdarzeń

Źródłem zdarzeń jest `strona/js/analytics.js`. GTM odbiera jedną kolejkę `window.dataLayer` na LP. Strona prywatności ma ustawienia zgód i nie inicjuje kontenera. Poniższa tabela wymienia wyłącznie parametry aplikacji. Biblioteki dostawców mogą dodać własne dane techniczne.

| Zdarzenie | Warunek i krotność | Parametry | Odbiorca |
| --- | --- | --- | --- |
| `page_view` | Pierwsze aktywowanie analityki dla aktualnego dokumentu, również przy wczytaniu zapamiętanej zgody. Raz na dokument. | `page_location` (origin + pathname), `page_title` | GA4 |
| `cta_click` | Każda aktywacja linku głównego CTA przy aktywnej analityce. | `cta_id` = navigation_cta / hero_cta / bottom_cta, `cta_location` = navigation / hero / bottom, `cta_text` = Zgłoś zainteresowanie | GA4 |
| `section_view` | Pierwszy pomiar spełnionej widoczności programu i aktywnej analityki, według reguły poniżej. | `section_id` = workshop_program | GA4 |
| `form_start` | Pierwsza rzeczywista edycja, zmiana wyboru lub próba zatwierdzenia, także z błędem. Wymaga aktywnej analityki w tym momencie. Raz na próbę w dokumencie. | `form_id` = workshop_interest_form | GA4 |
| `generate_lead` | Walidacja wszystkich pól, wyczyszczenie formularza, wyświetlenie sukcesu. Raz na dokument, przy przynajmniej jednej zgodzie. Każdy tag sprawdza własną kategorię. | `form_id` = workshop_interest_form | GA4 pod tą samą nazwą, Meta jako Lead |
| `equisoul_analytics_ready` | Pierwsza aktywna zgoda analityczna w dokumencie. | `page_location`, `page_title` | GTM → konfiguracja Google tag i Clarity |
| `equisoul_marketing_ready` | Pierwsza aktywna zgoda marketingowa w dokumencie. | `page_location`, `page_title` | GTM → inicjalizacja Meta + PageView |
| `equisoul_consent_update` | Stan początkowy, następnie faktyczna zmiana zgody bez przeładowania. Po wycofaniu nowy dokument emituje aktualny stan. | `consent_analytics`, `consent_marketing` (Boolean) | Tylko GTM |

Wysokość widocznej części sekcji musi przez co najmniej 1000 ms wynosić co najmniej `0,5 × min(wysokość sekcji, wysokość ekranu)`. Skrócenie ekspozycji lub ukrycie karty resetuje czas. Ustawienia prywatności otwarte w dialogu również wstrzymują pomiar. Obserwatory widoczności i rozmiaru, przewijanie oraz zmiany rozmiaru uruchamiają ponowną ocenę. Po spełnieniu warunku obserwacja kończy się na czas tego dokumentu. Na telefonie miara opisuje widok fragmentu programu, bez gwarancji przeczytania czterech etapów.

Przy zgodzie w trakcie wizyty odsłona dotyczy bieżącego widoku od momentu zgody. Wcześniejsze CTA, start i sukces się nie odtwarzają. Jeśli ktoś zaczął formularz przed zgodą, może mieć po zgodzie sam `generate_lead`. Zapamiętana zgoda działa od rozpoczęcia kolejnego dokumentu. Pełne przeładowanie, w tym po wycofaniu zgody, rozpoczyna nową próbę strony. W obrębie tej samej próby nie są używane trwałe identyfikatory formularza.

Wartości pól formularza są poza schematem danych. Źródło strony nie wysyła formularza. CSP blokuje natywne wysłanie, a pola nie mają atrybutu `name`. W GTM wymagana jest konfiguracja prywatności dostawców opisana w [przewodniku](../gtm/configuration-guide.md).
