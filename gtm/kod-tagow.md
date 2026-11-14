# Kod do ręcznej konfiguracji GTM

## EquiSoul Consent Bridge

Utwórzcie **Templates → Tag Templates → New**. W zakładce **Fields** dodajcie pole checkbox `isDefault` z etykietą „Ustaw domyślne denied”. Zapiszcie szablon, następnie utwórzcie dwa tagi z odpowiednim ustawieniem tego pola.

```js
const copyFromDataLayer = require('copyFromDataLayer');
const setDefaultConsentState = require('setDefaultConsentState');
const updateConsentState = require('updateConsentState');

if (data.isDefault) {
  setDefaultConsentState({
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
} else {
  const analytics = copyFromDataLayer('consent_analytics') === true ? 'granted' : 'denied';
  const marketing = copyFromDataLayer('consent_marketing') === true ? 'granted' : 'denied';
  updateConsentState({
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing
  });
}
data.gtmOnSuccess();
```

W **Permissions** nadajcie `Read data layer` do `consent_analytics` i `consent_marketing` oraz `Accesses consent state` z prawem **Write** do czterech typów użytych powyżej. W Preview sprawdźcie stan przy **Consent Initialization** oraz przed tagami dostawców dla każdego wyboru. [API szablonów](https://developers.google.com/tag-platform/tag-manager/templates/api)

## GA4 | Publish ID

Custom HTML, używany w sekwencji przed Google tag. Dodatkowo wymaga `analytics_storage`. Ustawcie once per page.

```html
<script>
  window.EquiSoulGa4MeasurementId = '{{CONST | GA4 ID}}';
</script>
```

## META | Init + PageView

Custom HTML, reguła Marketing ready. Wklejcie z **Events Manager** bieżący fragment inicjalizujący bibliotekę `fbq` i ładowanie `fbevents.js`, usuwając z niego polecenia `init`, `track` i część noscript. Umieśćcie sam fragment inicjalizacyjny w miejscu komentarza w poniższym kodzie.

```html
<script>
(function () {
  var id = '{{CONST | Meta ID}}';
  if (!/^\d+$/.test(id) || !window.EquiSoulConsent.get().marketing) return;

  // Wklejcie tu aktualny fragment ładujący fbevents.js z Events Manager.

  if (typeof window.fbq !== 'function') return;
  window.fbq('consent', 'grant');
  window.fbq('set', 'autoConfig', false, id);
  window.fbq('init', id);
  window.fbq('trackSingle', id, 'PageView');
})();
</script>
```

## META | Lead

Custom HTML. Reguła `CE | Meta Lead` i komplet zgód marketingowych. Polecenie czeka w kolejce `fbq`, gdy biblioteka została zainicjalizowana i skrypt jest jeszcze w drodze.

```html
<script>
(function () {
  var id = '{{CONST | Meta ID}}';
  if (!/^\d+$/.test(id) || !window.EquiSoulConsent.get().marketing) return;
  if (typeof window.fbq === 'function') window.fbq('trackSingle', id, 'Lead');
})();
</script>
```

## CLARITY | Init

Custom HTML, reguła Analytics ready i dodatkowa zgoda analityczna. Kod tworzy kolejkę `clarity`, dodaje sygnał zgody i ładuje projekt Microsoft. Zweryfikujcie zgodność adresu skryptu z fragmentem wyświetlanym dla Waszego projektu w Settings → Setup.

```html
<script>
(function () {
  var id = '{{CONST | Clarity ID}}';
  if (!/^[a-zA-Z0-9]+$/.test(id) || !window.EquiSoulConsent.get().analytics) return;
  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(id);
  document.head.appendChild(tag);
})();
</script>
```
