# Słownik zdarzeń

| Zachowanie | Sygnał źródłowy lub reguła | GA4 | Meta | Parametry i częstotliwość |
| --- | --- | --- | --- | --- |
| Wyświetlenie LP | `cookie_consent_update` z Cookiebot i tag bazowy właściwego dostawcy | `page_view` automatycznie z Google tag | `PageView` z base | Adres LP, w GA4 także wejściowe UTM. Raz na dokument na dostawcę i tylko przy jego zgodzie. |
| Kliknięcie CTA | `cta_click` | `cta_click` | — | `cta_location` = navigation, hero lub bottom. Każde rzeczywiste kliknięcie. |
| Widoczność oferty | GTM Element Visibility na ID `workshop_program_summary` | `section_view` | — | `section_id=workshop_program_summary`, co najmniej 50% i 2000 ms czasu kwalifikowanego, raz na stronę. |
| Rozpoczęcie formularza | `form_start` | `form_start` | — | `form_id=workshop_interest_form`, raz na dokument po pierwszej rzeczywistej zmianie pola. Sam fokus i pusta próba nie są zmianą. |
| Poprawny sukces | `lead_success` | `generate_lead` | `Lead` | `form_id=workshop_interest_form` w kolejce i GA4. Meta bez wartości pól i bez dodatkowych parametrów aplikacji. Maksymalnie raz na dokument. |

Główne CTA zachowują istniejące ID. Tylko `cta_location` jest mierzonym parametrem CTA. Trzy wymiary Event to `cta_location`, `form_id`, `section_id`. Zdarzenie kluczowe `generate_lead` ma metodę raz na zdarzenie. `cookie_consent_update` to sygnał CMP dla GTM.

W trybie lokalnym niezależnie od wyboru UI można sprawdzić trzy sygnały aplikacji w kolejce. W trybie Cookiebot CTA i start wymagają aktualnej zgody analitycznej, a sukces jest sygnałem dla co najmniej jednej aktywnej kategorii. Każdy tag ponownie weryfikuje własne wymagania Consent Mode. Zmiana zgody nie emituje historycznych zdarzeń. Rozpoczęcie przed zgodą i ukończenie po niej może dać obserwowany sukces bez startu. Użycie opcji prywatności nie tworzy zdarzeń formularza.

W kodzie LP `form.js` waliduje i kolejno blokuje przycisk, czyści pola, pokazuje potwierdzenie oraz emituje sygnał DOM. `analytics.js` przekształca sygnał na `lead_success`. Wartości pól pozostają w kontrolkach, których nie serializujemy. `page_view` i `section_view` powstają w GTM/Google tag. Były kiedyś w lokalnej kolejce i po rewizji zostały usunięte z JS. [Konfiguracja](../gtm/configuration-guide.md)
