# Konfiguracja GTM, GA4, Meta i Clarity

| Pole | Wartość do uzupełnienia |
| --- | --- |
| Publiczny HTTPS | [adres LP] |
| Kontener web | [ID GTM z nagłówka Workspace] |
| GA4 | [nazwa usługi i Measurement ID] |
| Meta | [nazwa źródła i identyfikator Pixela] |
| Clarity | [nazwa i identyfikator projektu] |
| Opublikowana wersja GTM | [numer, data] |

## 1. Kontener i prywatność

1. Utwórzcie jeden kontener Web w GTM i nadajcie członkom zespołu właściwe uprawnienia przez platformę. W **Admin → Container Settings** włączcie **Consent Overview**.
2. Dodajcie jeden lokalny szablon tagu `EquiSoul Consent Bridge` według [kodu i uprawnień](kod-tagow.md). Dodajcie dwie instancje tego szablonu. Tag `CONSENT | Default denied` z zaznaczonym polem `isDefault` uruchamiajcie na **Consent Initialization – All Pages**. Tag `CONSENT | Apply choice` z odznaczonym polem uruchamiajcie na `CE | Consent update`. W obu wybierzcie **No additional consent required**. Te tagi ustawiają stan bez ładowania bibliotek.
3. W kodzie strony wpiszcie ID kontenera w `strona/js/config.js`. Nie dodawajcie standardowego snippetu GTM, iframe noscript, osobnego Google tag, Pixela ani Clarity do HTML. Loader projektu wstawia jeden skrypt po przynajmniej jednej zgodzie.
4. Opublikujcie pliki przez GitHub Pages i sprawdźcie ścieżkę produkcyjną. Najpierw testujcie konfigurację z **Preview**, zanim opublikujecie wersję kontenera. W nowym kontenerze nie wstawiajcie niesprawdzonych tagów z innych projektów.

`analytics_storage` odpowiada kategorii analitycznej. `ad_storage`, `ad_user_data` i `ad_personalization` odpowiadają kategorii marketingowej. Most korzysta z API GTM i jawnie ustawia odmowę w Consent Initialization. Zmiana zgód jest przetwarzana przed następnymi zdarzeniami z kolejki. Tagi dostawców mają dodatkowe kontrole zgody oraz warunki reguł. Przy wycofaniu strona zmienia stan w pamięci, próbuje zatrzymać uruchomione narzędzia, czyści dostępne cookies wycofanej kategorii i przeładowuje stronę. [Wariant podstawowy](https://developers.google.com/tag-platform/security/concepts/consent-mode), [szablony zgody GTM](https://developers.google.com/tag-platform/tag-manager/templates/consent-apis), [opty-out GA4](https://developers.google.com/tag-platform/security/guides/privacy)

### Warstwa zmiennych

Wszystkie zmienne DLV mają typ **Data Layer Variable**, wersja 2. Przy wartościach logicznych w warunku **equals true** sprawdźcie w Preview, że zmienna ma typ Boolean.

| Nazwa zmiennej | Klucz / wartość |
| --- | --- |
| DLV \| consent_analytics | `consent_analytics` |
| DLV \| consent_marketing | `consent_marketing` |
| DLV \| page_location | `page_location` |
| DLV \| page_title | `page_title` |
| DLV \| cta_id | `cta_id` |
| DLV \| cta_location | `cta_location` |
| DLV \| cta_text | `cta_text` |
| DLV \| section_id | `section_id` |
| DLV \| form_id | `form_id` |
| CONST \| GA4 ID | Stała z rzeczywistym ID pomiaru GA4 |
| CONST \| Meta ID | Stała z rzeczywistym ID Pixela |
| CONST \| Clarity ID | Stała z rzeczywistym ID projektu |

### Reguły i tagi

Reguły `CE` mają typ **Custom Event**, dopasowanie dokładne, bez regexu. Kolumna „Warunek” dotyczy DLV, a kolumna „Zgody” opisuje **Require additional consent for tag to fire**. `A` to `analytics_storage`, a `M` to wszystkie trzy `ad_*` z mapowania powyżej.

| Reguła | Zdarzenie | Warunek | Tag | Zgody |
| --- | --- | --- | --- | --- |
| Consent Initialization – All Pages | inicjalizacja | każde | CONSENT \| Default denied | — |
| CE \| Consent update | equisoul_consent_update | każde | CONSENT \| Apply choice | — |
| CE \| Analytics ready | equisoul_analytics_ready | consent_analytics = true | GA4 \| Google tag, CLARITY \| Init | A |
| CE \| GA4 page_view | page_view | consent_analytics = true | GA4 \| page_view | A |
| CE \| GA4 cta_click | cta_click | consent_analytics = true | GA4 \| cta_click | A |
| CE \| GA4 section_view | section_view | consent_analytics = true | GA4 \| section_view | A |
| CE \| GA4 form_start | form_start | consent_analytics = true | GA4 \| form_start | A |
| CE \| GA4 generate_lead | generate_lead | consent_analytics = true | GA4 \| generate_lead | A |
| CE \| Marketing ready | equisoul_marketing_ready | consent_marketing = true | META \| Init + PageView | M |
| CE \| Meta Lead | generate_lead | consent_marketing = true | META \| Lead | M |

`GA4 | Google tag` to typ **Google tag**, `{{CONST | GA4 ID}}`. Ustawcie **Once per page** i skonfigurujcie `GA4 | Publish ID` jako setup tag dla Google tag, zgodnie z [kodem](kod-tagow.md). W **Configuration settings** ustawcie `send_page_view = false`, `page_location = {{DLV | page_location}}`, `page_title = {{DLV | page_title}}`, `allow_google_signals = false`, `allow_ad_personalization_signals = false`. Użyjcie wartości false jako Boolean, np. zmiennej Custom JavaScript zwracającej literal `false` przy polu bez przełącznika logicznego. Nie podłączajcie dodatkowych miejsc docelowych do Google tag. W Preview sprawdźcie, że `GA4 | Google tag` jest inicjowany na `equisoul_analytics_ready` przed `page_view`. Nie dodawajcie kolejnej kopii Google tag do samego zdarzenia.

Pozostałe tagi GA4 mają typ **Google Analytics: GA4 Event**, ten sam identyfikator i nazwę zdarzenia równą nazwie po `GA4 |`. W **Event Parameters** wpiszcie tylko parametry z [tabeli zdarzeń](../dokumentacja/specyfikacja-zdarzen.md) i przypiszcie odpowiadające im DLV. Nie używajcie zmiennych typu Form Element, Click Text, User-Provided Data ani autozbierania z formularza. Tag dla `generate_lead` nie przejmuje parametrów poprzedniego zdarzenia z DLV. Meta i Clarity używają [tagów Custom HTML](kod-tagow.md) oraz opisanych w tabeli dodatkowych zgód. Ustawcie **Once per page** dla inicjalizacji Meta i Clarity, **Once per event** dla Meta Lead oraz tagów GA4 Event. Nie dołączajcie ich do All Pages, DOM Ready lub Window Loaded.

## 2. Google Analytics 4

1. W **Admin** utwórzcie usługę projektu. Ustawcie strefę raportowania odpowiadającą Polsce. W **Data streams → Add stream → Web** podajcie rzeczywisty HTTPS i nazwę `EquiSoul LP`. Skopiujcie Measurement ID do `CONST | GA4 ID`.
2. W strumieniu wyłączcie **Enhanced Measurement**. W konfiguracji wybiórczej wyłączcie **Form interactions** oraz **Page changes based on browser history events** w ustawieniach Page views. Automatyczny odsłonowy hit inicjalizacji kontroluje `send_page_view = false` w GTM. [Page views](https://developers.google.com/analytics/devguides/collection/ga4/views), [Enhanced Measurement](https://support.google.com/analytics/answer/9216061)
3. W **Admin → Custom definitions → Create custom dimension** dodajcie wymiary o zakresie **Event**. Użyjcie kluczy `cta_id`, `cta_location`, `cta_text`, `section_id`, `form_id`. Wymiary Page location i Page title są wbudowane. [Definicje niestandardowe](https://support.google.com/analytics/answer/14239696)
4. W **Admin → Events** oznaczcie odebrane `generate_lead` jako zdarzenie kluczowe lub dodajcie tę nazwę w **Key events** przed testami. Wybierzcie metodę liczenia raz na zdarzenie. Nie definiujcie kopii regułą Create event z tym samym wyzwalaczem.
5. W **Preview** wprowadźcie publiczny URL. W zresetowanym profilu sprawdźcie najpierw Network bez decyzji i po odmowie, także bez Preview. W Preview przy zgodzie analitycznej sprawdźcie kolejność: Consent Initialization, aktualizacja zgód, gotowość, pojedyncze `page_view`. Porównajcie **Tags Fired**, **Variables**, **Consent** i **Data Layer** dla każdego zdarzenia. Przy obu dozwolonych kategoriach jeden `generate_lead` wyzwala oba tagi odbiorców. Przy zgodzie tylko marketingowej wyzwala wyłącznie Meta Lead. [Debugowanie zgody](https://developers.google.com/tag-platform/security/guides/consent-debugging)
6. W **DebugView** wybierzcie przeglądarkę testową. Jeśli połączenie Preview nie daje sygnału debug, ustawcie `debug_mode=true` wyłącznie w wersji testowej tagu i usuńcie przed publikacją. Wykonajcie test CTA, widoczności programu, pustego formularza, błędnego e-maila i ukończenia. Sprawdźcie parametry i brak duplikatów, powtórzcie bez CTA. [DebugView](https://support.google.com/analytics/answer/7201382)
7. Utwórzcie dwie **Funnel explorations**, dodatkowy lejek programu i tabelę kliknięć zgodnie z [analizą](../dokumentacja/analiza-danych.md). Zapiszcie reguły eksploracji nawet gdy po testach liczba zdarzeń jest niewystarczająca do wnioskowania.

## 3. Meta Pixel i odbiorcy

1. W **Events Manager → Connect data → Web** utwórzcie źródło danych zespołu i wybierzcie konfigurację Pixela. Ustawcie uprawnienia obu członków zespołu. Skopiujcie ID do `CONST | Meta ID`.
2. Użyjcie dwóch tagów GTM według [kodu](kod-tagow.md). Nie instalujcie drugi raz integracji partnerskiej ani skryptu w HTML. W ustawieniach źródła wyłączcie **Automatic Advanced Matching** i automatyczne wykrywanie zdarzeń. Nie używajcie Event Setup Tool do dodania leada po kliknięciu.
3. W **Test Events** otwórzcie LP z Events Managera. Przy zgodzie tylko marketingowej sprawdźcie `PageView`. Pusty i błędny formularz powinny dać zero `Lead`. Poprawny, fikcyjny formularz powinien dać dokładnie jedno `Lead`. Przy samej analityce, odmowie i po wycofaniu sprawdźcie brak skryptu i hitów Meta. Zestawcie Events Manager z Network i, gdy dostępny, **Meta Pixel Helper**. Sprawdźcie **Diagnostics** źródła. [Meta Pixel](https://developers.facebook.com/docs/meta-pixel/), [zgody Pixela](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/)
4. W **Audiences** dodajcie Website Custom Audience, według [reguł i kreacji](../dokumentacja/remarketing.md). Dołączcie zrzut konfiguracji uwzględnienia i wykluczenia, niezależnie od bieżącej liczebności grupy.

## 4. Microsoft Clarity

1. Utwórzcie projekt z publicznym URL. W **Settings → Setup** odczytajcie identyfikator projektu. Skopiujcie go do `CONST | Clarity ID`. Dodajcie wyłącznie tag GTM z [kodu](kod-tagow.md).
2. W **Settings → Masking** włączcie **Strict** i potwierdźcie, że obszary formularza i zgód mają `data-clarity-mask="True"`. Nie wywołujcie `identify`. Skrypt uruchamia się po zgodzie analitycznej i przekazuje `ad_Storage: denied` również przy zgodzie marketingowej, gdyż Clarity pełni wyłącznie funkcję analityczną. [ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2), [maskowanie](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking)
3. Przy odmowie i samej zgodzie marketingowej sprawdźcie brak żądań Clarity. Przy samej analityce sprawdźcie instalację na LP i nową sesję na liście **Recordings**, wpisując wyłącznie dane fikcyjne. Potwierdźcie zamaskowane wartości, w tym stan formularza po błędzie. Przy wycofaniu sprawdźcie kolejne żądania według procedury w planie testów. [Weryfikacja instalacji](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup)
4. Przygotujcie mapę kliknięć i przewijania dla URL LP osobno dla mobile i desktopu. Oceńcie widoczność CTA i sekcji, martwe kliknięcia oraz problemy z nawigacją lub walidacją. Porównajcie z nagraniem i lejkiem, zapisując hipotezę oraz opis warunku jej weryfikacji. [Mapy interakcji](https://learn.microsoft.com/en-us/clarity/heatmaps-overview)

## 5. Opcja wdrożenia Cookiebot

W paczce działa lokalny mechanizm **EquiSoul – ustawienia zgód**. Nie jest certyfikowanym CMP. Sprawdźcie możliwość dodania rzeczywistego hosta GitHub Pages do grupy domen oraz limit planu według skanu, także gdy inne podstrony korzystają z tego samego hosta. Jeżeli użyjecie Cookiebot, zamieńcie interfejs i źródło stanu w `consent.js`. Przycisk preferencji powinien wywołać `Cookiebot.renew()`. Odczyt `Cookiebot.consent.statistics` i `Cookiebot.consent.marketing` wykonajcie po `CookiebotOnConsentReady` oraz po `CookiebotOnAccept` i `CookiebotOnDecline`, z deduplikacją identycznego stanu. Zachowajcie kontrakt `get/subscribe`, rzeczywistą blokadę skryptów, zatrzymanie i przeładowanie przy odebraniu zgody. Publikujcie tylko jedno źródło stanu Google Consent Mode. Przy zachowaniu mostu GTM wyłączcie automatyczną wysyłkę sygnałów Google przez CMP zgodnie z jego dokumentacją. Wykonajcie ponownie całą macierz zgód. Ten wariant wymaga konta i weryfikacji hosta. [Plany Cookiebot](https://support.cookiebot.com/hc/en-us/articles/360003807613-How-can-I-get-a-Free-subscription), [API Cookiebot](https://www.cookiebot.com/en/developer/)

## 6. Publikacja kontenera i dowody

Po przejściu testów wybierzcie **Submit → Publish and Create Version**. Nazwijcie wersję np. `EquiSoul | LP + Consent + GA4 + Meta + Clarity`. Z **Admin → Export Container** wyeksportujcie konkretną opublikowaną wersję do `gtm/container-published.json`. Powtórzcie pomiar pozytywny i test odmowy poza Preview. Dołączcie dowody opisane w [indeksie](../dowody/README.md). [Eksport kontenera](https://support.google.com/tagmanager/answer/6106997)
