(() => {
  'use strict';

  const config = window.EquiSoulConfig;
  if (config.consentMode !== 'cookiebot') return;

  const queue = window.dataLayer = window.dataLayer || [];
  let current = Object.freeze({ analytics: false, marketing: false });
  let reloading = false;

  function updateFromCookiebot() {
    const cmp = window.Cookiebot;
    if (!cmp?.consent || reloading) return;

    const next = Object.freeze({
      analytics: cmp.consent.statistics === true,
      marketing: cmp.consent.marketing === true
    });
    const lostAnalytics = current.analytics && !next.analytics;
    const lostMarketing = current.marketing && !next.marketing;
    current = next;

    if (lostAnalytics || lostMarketing) {
      reloading = true;
      if (lostAnalytics) {
        const id = window.EquiSoulGa4MeasurementId;
        if (typeof id === 'string' && /^G-[A-Z0-9]+$/.test(id)) window['ga-disable-' + id] = true;
        if (typeof window.clarity === 'function') window.clarity('stop');
      }
      if (lostMarketing && typeof window.fbq === 'function') window.fbq('consent', 'revoke');
      // Cookiebot zapisał decyzję. Nowy dokument odczyta ją bez ponownego przeładowania.
      location.reload();
    }
  }

  // Rejestracja przed pobraniem GTM, również gdy decyzja była zapisana wcześniej.
  window.addEventListener('CookiebotOnConsentReady', updateFromCookiebot);
  window.addEventListener('CookiebotOnAccept', updateFromCookiebot);
  window.addEventListener('CookiebotOnDecline', updateFromCookiebot);

  window.EquiSoulConsent = Object.freeze({
    get: () => reloading ? { analytics: false, marketing: false } : current
  });

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('[data-consent-open]');
    function showButtons() {
      if (typeof window.Cookiebot?.renew !== 'function') return;
      for (const button of buttons) button.hidden = false;
    }

    for (const button of buttons) {
      button.addEventListener('click', () => window.Cookiebot.renew());
    }
    window.addEventListener('CookiebotOnConsentReady', showButtons);
    window.addEventListener('CookiebotOnDialogInit', showButtons);
    showButtons();
  });

  // GTM uruchamia Cookiebot przed decyzją. Dodatkowe zgody w GTM blokują tagi pomiarowe.
  const id = config.gtmContainerId;
  if (!/^GTM-[A-Z0-9]+$/.test(id)) return;
  queue.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
  document.head.append(script);
})();
