# Kod i sekwencje tagów

Cookiebot i Microsoft Clarity używają szablonów galerii według [instrukcji](configuration-guide.md). Polecenia poniżej służą do ręcznej konfiguracji na właściwym koncie.

## GA4 – Register Measurement ID

Tag **Custom HTML**, tylko jako setup tag dla `GA4 – Google tag`, z dodatkowym wymaganiem `analytics_storage`, raz na stronę. Umożliwia stronie ustawienie `ga-disable-…` przy cofnięciu analityki.

```html
<script>
window.EquiSoulGa4MeasurementId = '{{CONST – GA4 ID}}';
</script>
```

## META – base and PageView

Tag **Custom HTML** z kodem pobranym ze źródła w Events Manager. Zostawcie inicjalizację i jeden PageView. Usuńcie część `noscript` Pixela, dodatkowe PageView i automatyczne dopasowanie. Wklejcie rzeczywiste ID ze źródła lub odwołanie do `CONST – Meta ID`. Ustawcie regułę **CE – consent update**, wszystkie trzy dodatkowe wymagania M i **Once per page**. Sprawdźcie po dodaniu taga, że konstruktor `fbq` jest gotowy przy kolejnej regule Lead.

## META – Lead

Tag **Custom HTML**, reguła **CE – lead_success**, **Once per event**, te same trzy wymagania M. W **Advanced Settings → Tag Sequencing** zaznaczcie **Fire a setup tag before** i wybierzcie `META – base and PageView`. Zaznaczcie pominięcie Lead, gdy setup nie powiedzie się. Zachowajcie **Once per page** w base. W Preview sprawdźcie, czy konfigurujący tag wykonuje się co najwyżej raz także przy tym sekwencjonowaniu. Kolejka `fbq` może poczekać na bibliotekę, potwierdzeniem pozostaje Test Events.

```html
<script>
if (window.EquiSoulConsent && window.EquiSoulConsent.get().marketing && typeof window.fbq === 'function') {
  window.fbq('track', 'Lead');
}
</script>
```

[Sequencing](https://support.google.com/tagmanager/answer/6238868) · [Zgody Meta](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/)
