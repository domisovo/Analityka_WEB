# EquiSoul · Pierwszy raz w siodle

Projekt 1 z przedmiotu „Analityka aplikacji webowych”. Statyczny landing page w HTML, CSS i JavaScript. Etap lokalny zawiera działającą stronę, pomiar w `dataLayer`, mechanizm zgód oraz testy odtwarzalne w Chromium.

## Uruchomienie

Rozpakuj archiwum i w katalogu projektu uruchom:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory strona
```

Otwórz [localhost:8765](http://127.0.0.1:8765/). Używaj fikcyjnego imienia i adresu `test@example.com`. Przejście formularza działa od razu. Identyfikator GTM jest pusty, więc lokalne zdarzenia po zgodzie można sprawdzić przez `window.dataLayer` w konsoli, bez wysyłania do dostawców.

## Publikacja GitHub Pages

1. Utwórz repozytorium w GitHub. Umieść katalogi projektu i pliki z jego katalogu głównego w katalogu głównym repozytorium. Uwzględnij ukryty katalog `.github`. Jeżeli używasz terminala, zastąp adres w cudzysłowie rzeczywistym adresem repozytorium.
   ```sh
   git init -b main
   git add .
   git commit -m "Dodaj projekt EquiSoul"
   git remote add origin 'ADRES_REPOZYTORIUM_HTTPS'
   git push -u origin main
   ```
2. Otwórz **Settings → Pages → Build and deployment → Source → GitHub Actions**. Uruchom workflow **Publikacja EquiSoul** przez **Actions → Run workflow** lub nowy push na `main`. Workflow wysyła wyłącznie `strona/` jako zawartość hostingu. Jeżeli repozytorium jest publiczne, jego źródła i dodane do niego dowody również będą publiczne, niezależnie od zakresu hostingu. Przed dodaniem dowodów usuń z nich dane kont.
3. Otwórz URL wyświetlony po publikacji w **Settings → Pages** i wpisz go w raporcie. Przejdź po kotwicach i otwórz prywatność. Sprawdź zasoby na ścieżce repozytorium oraz HTTPS. [Instrukcja GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
4. Skonfiguruj usługi według [przewodnika](gtm/configuration-guide.md), uzupełnij prawdziwy identyfikator w `strona/js/config.js`, opublikuj zmianę i wykonaj testy z kontami. Eksport GTM z wersji opublikowanej należy do `gtm/`.

## Pliki projektu

| Ścieżka | Zawartość |
| --- | --- |
| `raport.md` | Stan projektu i pola zespołu |
| `strona/index.html`, `strona/privacy.html`, `strona/css/style.css` | Landing page, ustawienia prywatności i style |
| `strona/js/main.js`, `form.js`, `analytics.js`, `consent.js`, `config.js` | Nawigacja, walidacja, zdarzenia, zgody i pole identyfikatora GTM |
| `strona/assets/images/`, `strona/assets/icons/` | Pięć plików WebP i favicon |
| `gtm/README.md`, `configuration-guide.md`, `kod-tagow.md` | Instrukcje konfiguracji, kod tagów i miejsce na prawdziwy eksport |
| `dokumentacja/` | Brief, makieta, plan pomiarowy, specyfikacja zdarzeń, decyzje AI, plan testów, analiza, remarketing, źródła i macierz zgodności |
| `dowody/` | Indeks dowodów, wynik JSON i zrzuty lokalne oraz katalogi platformowe |
| `tests/browser.cjs` | Automatyczne testy w Chromium |
| `.github/workflows/pages.yml` | Workflow publikacji statycznej |

## Powtórzenie testów

Testy korzystają z Node i Playwright wyłącznie w czasie weryfikacji. Przy uruchomionym lokalnym serwerze z pustym ID GTM:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/browser.cjs
```

Domyślny adres można zmienić przez `EQUISOUL_URL`. Przy gotowym środowisku Playwright `PLAYWRIGHT_MODULE` może wskazywać jego moduł. Skrypt aktualizuje lokalny JSON z wynikami i zrzuty w `dowody/`. Testy dostawców opisuje [plan testów](dokumentacja/plan-testow.md).
