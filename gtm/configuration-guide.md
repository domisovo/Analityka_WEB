# GTM, Cookiebot, GA4, Meta i Clarity

| Wartość | Do uzupełnienia z panelu |
| --- | --- |
| Publiczny URL HTTPS | [adres i dokładna ścieżka LP] |
| GTM Web | [Container ID] |
| Cookiebot | [domena i Domain Group ID] |
| GA4 | [usługa, strumień WWW, Measurement ID] |
| Meta | [źródło zespołu i Pixel ID] |
| Clarity | [projekt i Project ID] |
| Wersja opublikowana GTM | [numer, opis, data] |

## 1. Cookiebot i podstawowy Consent Mode v2

1. W GTM utwórzcie osobny kontener **Web**. W **Admin → Container Settings** włączcie **Consent Overview**. W Cookiebot dodajcie dokładny host publicznego LP, sprawdźcie skan, plan i dostęp zespołu. Ustawcie język polski, odmowę, akceptację oraz wybór kategorii.
2. Zaimportujcie z galerii szablon **Cookiebot CMP**. Utwórzcie tag `CMP – Cookiebot` z Domain Group ID, trybem ręcznego blokowania i regułą **Consent Initialization – All Pages**. Włączcie Google Consent Mode. Ustawcie globalnie `denied` dla `analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`. Statystyka steruje pierwszym stanem, marketing trzema następnymi. Sam tag CMP jest niezbędny i nie wymaga zgody opcjonalnej. [Instalacja Cookiebot w GTM](https://support.cookiebot.com/hc/en-us/articles/360003793854-Google-Tag-Manager-deployment)
3. W **Triggers** dodajcie **CE – consent update**, typ **Custom Event**, dokładna nazwa `cookie_consent_update` emitowana przez Cookiebot. Regułę ograniczcie przez Page Path według sekcji 2. Stany na tym zdarzeniu sprawdźcie w Preview. Same reguły All Pages nie wykonują się ponownie po pierwszej zgodzie. [Konfiguracja wariantu podstawowego](https://support.cookiebot.com/hc/en-us/articles/14448386844700-Configuring-tags-for-basic-consent-mode)
4. Po skonfigurowaniu reguł ustawcie `consentMode: 'cookiebot'` i prawdziwe ID w `strona/js/config.js`. Adapter w `head` inicjuje istniejące `dataLayer` i pobiera GTM **przed decyzją** na LP i prywatności. Ze snippetu GTM dodajcie wymagany w spotkaniu 3 rzeczywisty iframe `noscript` tuż po otwarciu `body` obu stron, tylko podczas wdrożenia Cookiebot. Przy wyłączonym JS nie udzieli on zgody i żadne tagi pomiarowe nie mogą się wtedy wykonać. Zweryfikujcie to w Network. Adapter już pełni funkcję skryptowej części snippetu; użyjcie jednego loadera. [Instalacja kontenera](https://support.google.com/tagmanager/answer/6103696)
5. Przycisk „Ustawienia prywatności” wywołuje `Cookiebot.renew()` po dostępności CMP. Adapter śledzi `CookiebotOnConsentReady`, `CookiebotOnAccept`, `CookiebotOnDecline`, porównuje stan i po odebraniu przyznanej kategorii przeładowuje dokument po zapisaniu decyzji. Przed przeładowaniem blokuje nowe sygnały aplikacji i w miarę dostępności ustawia opt-out GA4, zatrzymuje Clarity oraz wycofuje zgodę Pixela dla wycofywanej kategorii. W nowym dokumencie dodatkowe wymogi w GTM blokują odpowiednie biblioteki. Sprawdźcie też zmianę zgody w drugiej karcie oraz ewentualne żądania w trakcie przeładowania, odróżniając je od nowych żądań po przeładowaniu. [API Cookiebot](https://www.cookiebot.com/en/developer/) · [GA4 opt-out](https://developers.google.com/tag-platform/security/guides/privacy)
6. Pozostawcie Cookiebot jako jedyne źródło stanu zgód. Usuńcie wcześniejsze tagi `CONSENT | EquiSoul Bridge`, `Default denied` i `Apply choice`, jeśli były tworzone według starszej instrukcji. W trybie `local` działa tylko demonstracyjny panel i lokalna kolejka. Nawet po wyborze zgód tryb lokalny nie pobiera GTM ani dostawców. W aktywnym Cookiebot ruch skryptu GTM i CMP przed decyzją jest oczekiwany. Brak hitów GA4, Meta i Clarity trzeba potwierdzić oddzielnie.

## 2. Zmienne, reguły i tagi

| Nazwa | Typ i źródło |
| --- | --- |
| CONST – GA4 ID | Stała, rzeczywisty Measurement ID |
| CONST – Meta ID | Stała, rzeczywisty Pixel ID |
| DLV – cta_location | Data Layer Variable v2, klucz `cta_location` |
| DLV – form_id | Data Layer Variable v2, klucz `form_id` |

Dla `CE – consent update` użyjcie warunku **Page Path matches RegEx** obejmującego dokładny katalog LP z końcowym ukośnikiem lub `index.html` (bez domeny, query i `privacy.html`). Przykład dla publikacji w podkatalogu `/projekt/`: `^/projekt/(?:index\.html)?$`. Dla witryny w korzeniu: `^/(?:index\.html)?$`. Filtr ścieżki zastosujcie też w trzech regułach sygnałów strony. Włączcie wbudowane zmienne **Page Path**, **Percent Visible**, **On-Screen Duration**.

**A** oznacza dodatkowe wymaganie `analytics_storage`. **M** oznacza komplet dodatkowych wymagań `ad_storage`, `ad_user_data`, `ad_personalization`. Ustawcie **Require additional consent for tag to fire**, nawet gdy tag ma wbudowane sprawdzanie zgód.

| Reguła GTM | Typ i warunek | Tag | Parametry / krotność | Zgody |
| --- | --- | --- | --- | --- |
| CE – consent update | Custom Event `cookie_consent_update` na LP | GA4 – Google tag | Tag ID z CONST, raz na stronę; automatyczne `page_view` | A |
| CE – cta_click | Custom Event `cta_click` | GA4 – cta_click | `cta_location={{DLV – cta_location}}`, raz na zdarzenie | A |
| CE – form_start | Custom Event `form_start` | GA4 – form_start | `form_id={{DLV – form_id}}`, raz na zdarzenie | A |
| CE – lead_success | Custom Event `lead_success` | GA4 – generate_lead | `form_id={{DLV – form_id}}`, raz na zdarzenie | A |
| EV – program summary | Element Visibility, ID `workshop_program_summary`, bez `#` | GA4 – section_view | `section_id=workshop_program_summary`, raz na stronę; 50% przez 2000 ms | A |
| CE – consent update | Jak wyżej | META – base and PageView | Kod pobrany z Meta, jeden PageView, taga raz na stronę | M |
| CE – lead_success | Jak wyżej | META – Lead | Jeden Lead; base jako tag konfigurujący | M |
| CE – consent update | Jak wyżej | CLARITY – Official | Project ID, raz na stronę | A |

**Widoczność.** Włączcie minimum on-screen duration 2000 ms, pozostawcie **Observe DOM changes** wyłączone dla statycznego bloku. GTM sumuje czas powyżej progu w danym wyświetleniu. Krótką próbę i próbę z pełnym progiem wykonajcie w oddzielnych przeładowaniach, z zapisaną zgodą przed przewijaniem. Jeżeli widoczność została osiągnięta bez zgody, tag pozostaje zablokowany i wcześniejszy wynik się nie odtwarza. [Reguła Element Visibility](https://support.google.com/tagmanager/answer/7679410)

## 3. GA4 i weryfikacja

1. Utwórzcie usługę i strumień WWW z publicznym HTTPS. W tagu bazowym zostawcie domyślne automatyczne `page_view` (bez `send_page_view=false`). Dodajcie opisany [tag pomocniczy z ID](kod-tagow.md) w sekwencji przed Google tag do obsługi wycofania. W strumieniu wyłączcie **Form interactions** oraz **Page changes based on browser history events**. W konfiguracji GA4 wyłączcie zbieranie danych przekazywanych przez użytkownika. Nie podpinajcie dodatkowych miejsc docelowych ani ręcznego taga odsłony. Nie nadpisujcie `page_location` adresem obciętym z UTM. [Page views](https://developers.google.com/analytics/devguides/collection/ga4/views) · [Enhanced Measurement](https://support.google.com/analytics/answer/9216061)
2. Dodajcie cztery tagi **Google Analytics: GA4 Event** według tabeli. W **Admin → Custom definitions** utwórzcie dokładnie trzy wymagane wymiary o zakresie **Event**: `cta_location`, `form_id`, `section_id`. Zróbcie to przed próbami. W **Admin → Events / Key events** oznaczcie `generate_lead` jako zdarzenie kluczowe, metoda **Once per event**. [Wymiary](https://support.google.com/analytics/answer/14239696) · [Zdarzenia kluczowe](https://support.google.com/analytics/answer/13366706)
3. Zbierajcie osobno dowód sygnału w `dataLayer`, wykonania taga w **Preview/Tag Assistant** i odbioru w **DebugView**. W **Network** kontrolujcie żądania pomiarowe, np. `/g/collect`; ruch GTM i CMP jest osobną kategorią. Przejdźcie scenariusze [testów](../dokumentacja/plan-testow.md), w tym pusta próba bez `form_start`, inny błędny formularz z rzeczywistą edycją oraz jeden sukces. [DebugView](https://support.google.com/analytics/answer/7201382) · [Debugowanie zgód](https://developers.google.com/tag-platform/security/guides/consent-debugging)
4. Przygotujcie eksploracje, wykonajcie po publikacji sześć prób poza Preview, sprawdźcie Realtime i uzupełnijcie wyniki po przetworzeniu ruchu. [Lejek, UTM i próby](../dokumentacja/analiza-danych.md)

| Objaw | Kontrola |
| --- | --- |
| Sygnał istnieje, tag niewyzwolony | Reguła, ścieżka, stan dodatkowych zgód na zdarzeniu |
| Tag wyzwolony, brak odbioru | ID, właściwy profil debug, Network, blokady przeglądarki |
| Odsłona lub zdarzenie występuje podwójnie | Druga instalacja, pomiar historii, automatyczny pomiar form, dodatkowa reguła lub listener |
| Parametr w DebugView, brak w eksploracji | Zakres Event, nazwa i czas przetwarzania |
| Działa tylko w Preview | Wersja opublikowana GTM, właściwy hostname i aktualny deploy |

## 4. Meta i Clarity

**Meta.** W Events Manager wybierzcie rzeczywiste źródło Web i pobierzcie aktualny kod Pixela z jego ID. [Kod i ustawienia sekwencji](kod-tagow.md). Wyłączcie automatyczne dopasowanie zaawansowane, automatyczne wykrywanie zdarzeń i duplikujące reguły Event Setup Tool. W **Test Events** sprawdźcie pojedyncze PageView i Lead, brak Lead po błędzie oraz odmowę, częściowe zgody i wycofanie. Potwierdźcie Network (`facebook.com/tr`) i ewentualnie Pixel Helper. [Meta Pixel](https://developers.facebook.com/docs/meta-pixel/) · [Remarketing](../dokumentacja/remarketing.md)

**Clarity.** W projekcie dla publicznego URL odczytajcie Project ID. W GTM ręcznie wybierzcie z galerii **Microsoft Clarity – Official**, wpiszcie ID, użyjcie wyłącznie **CE – consent update** z filtrem LP, raz na stronę, z dodatkowym wymaganiem A. W ustawieniach projektu włączcie obsługę Consent Mode oraz maskowanie **Strict**. Strona ma dodatkowe `data-clarity-mask="True"` na formularzu. Zgody przekazuje Google Consent Mode z Cookiebot. Przy samej analityce spodziewajcie się `analytics_storage: GRANTED` i `ad_storage: DENIED`, przy obu odpowiednio obu `GRANTED`. W uruchomionej sesji wykonajcie kontrolę:

```js
clarity('metadata', (data, upgrade, consent) => console.log('consentStatus:', consent), false, true, true);
```

Sprawdźcie sygnały, nagranie po nowej próbie, maskowanie i mapy. Jeżeli `metadata` nie pokazuje oczekiwanego stanu, wstrzymajcie zbieranie do zweryfikowania wersji szablonu, integracji i sygnałów. Przy wycofaniu kontrolujcie także Network po przeładowaniu. [Szablon GTM](https://learn.microsoft.com/en-us/clarity/third-party-integrations/google-tag-manager) · [Zarządzanie zgodami](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-management) · [Kontrola stanu](https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-consent) · [Strict](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)

## 5. Publikacja

Po sprawdzeniu tagów opublikujcie kontener z opisem zmian, odnotujcie numer w raporcie i powtórzcie [macierz zgód](../dokumentacja/plan-testow.md#macierz-zgód-na-opublikowanym-lp) poza Preview. Wyeksportujcie konkretną opublikowaną wersję do `gtm/container-published.json`. [Eksport GTM](https://support.google.com/tagmanager/answer/6106997)
