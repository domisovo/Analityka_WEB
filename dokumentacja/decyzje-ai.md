# Świadome wykorzystanie AI

Polecenia poniżej są fragmentami otrzymanej specyfikacji. Uzupełnijcie własną ocenę po wspólnym przejrzeniu projektu.

## D1. Struktura i treść

- Polecenie „Sekcja ma natychmiast komunikować, czego dotyczy oferta, dla kogo jest przeznaczona i jakie działanie powinien wykonać użytkownik.”
- Propozycja AI. Pokazać ofertę, odbiorcę i CTA w hero, dodać pasek z czterema kluczowymi informacjami, później wyjaśnić program i poziom wejścia.
- Uzasadnienie. Odbiorca może szybko ocenić czas, cenę i logistykę oraz dojść do formularza z trzech miejsc.
- Alternatywa. Umieścić informacje logistyczne wyłącznie w szczegółach pod programem.
- Wada. Wybrane fakty występują dwukrotnie. Na telefonie pasek jest poniżej pierwszego ekranu.
- Własna ocena i decyzja zespołu. **[Ocena, przyjęta lub zmieniona propozycja, uzasadnienie, inicjały obu osób]**
- Weryfikacja i wynik. F02 i F04 sprawdziły przejście trzech CTA do jednego celu i brak przewijania poziomego przy 320, 390, 768 i 1440 px. Dwa zrzuty pokazują hero. Zrozumiałość oferty przez odbiorców pozostaje do sprawdzenia.

## D2. UX i implementacja

- Polecenie „Umożliwiać obsługę klawiaturą” oraz „Pokazywać czytelne komunikaty błędów”.
- Propozycja AI. Po użyciu CTA ustawiać fokus na nagłówku formularza, po błędzie na pierwszym błędnym polu, a po sukcesie na potwierdzeniu. Opisy błędów połączyć przez `aria-describedby`.
- Uzasadnienie. Po zmianie sekcji lub walidacji kolejna akcja jest osiągalna w przewidywalnym miejscu.
- Alternatywa. Użyć natywnego mechanizmu komunikatów walidacji przeglądarki.
- Wada. Własny mechanizm zwiększa zakres testów klawiaturą i z czytnikami ekranu.
- Własna ocena i decyzja zespołu. **[Ocena, zmiany, uzasadnienie, inicjały]**
- Weryfikacja i wynik. Pierwsza próba F02 wykazała utratę fokusu po domyślnej nawigacji do kotwicy. Kod zachowuje adres z hashem i jawnie ustawia fokus oraz przewijanie. Powtórzenie F02 i F05/F06 przeszło. F07 potwierdził fokus i błędy przy niepoprawnej próbie.

## D3. Pomiar widoczności

- Polecenie „Sprawdź, czy warunek może zostać spełniony również na urządzeniach mobilnych, gdzie sekcja może być wyższa od ekranu.”
- Propozycja AI. Wymagać połowy mniejszej wysokości z sekcji i okna widoku przez sekundę, po zgodzie analitycznej.
- Uzasadnienie. Nawet długa sekcja może spełnić próg w pionowym oknie telefonu. Pomiar odfiltrowuje szybkie przewinięcie.
- Alternatywa. Mierzyć widoczność nagłówka i pierwszego etapu przez sekundę.
- Wada. Mobilny i desktopowy próg opisują różną część programu. Zdjęcia, inne układy i poziom powiększenia mogą zmienić wysokości.
- Własna ocena i decyzja zespołu. **[Ocena, zmiany, uzasadnienie, inicjały]**
- Weryfikacja i wynik. A03-390 zaliczony przy programie 1070 px w oknie 670 px. A03-1440 zaliczony przy 742/900 px. Krótka ekspozycja dała 0 zdarzeń, pozostanie i powrót dały łącznie 1. Odbiór w GA4 wymaga testu na wdrożeniu.

## Praca w parze

| Zakres | Wykonujący | Sprawdzający | Własne wnioski |
| --- | --- | --- | --- |
| Brief, makieta i LP | [osoba] | [osoba] | [uzupełnijcie] |
| Testy, zgody i GTM | [osoba] | [osoba] | [uzupełnijcie] |
| Meta, Clarity i analiza | [osoba] | [osoba] | [uzupełnijcie] |

Na prezentacji każda osoba odpowiada za wyjaśnienie celu LP, drogi zdarzenia do GA4 i Meta i jednego testu. Zapiszcie, kto powtórzył test i kiedy.
