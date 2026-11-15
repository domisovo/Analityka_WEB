(() => {
  'use strict';

  const queue = window.dataLayer = window.dataLayer || [];
  const local = window.EquiSoulConfig.consentMode === 'local';
  const form = document.getElementById('workshop_interest_form');

  function canMeasure(marketingAllowed = false) {
    // Lokalna kolejka służy do ćwiczeń także po odmowie. Ten tryb nie ładuje GTM.
    if (local) return true;
    const consent = window.EquiSoulConsent?.get();
    return consent?.analytics || (marketingAllowed && consent?.marketing);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-cta-location]');
    if (!event.isTrusted || !button || !canMeasure()) return;
    queue.push({ event: 'cta_click', cta_location: button.dataset.ctaLocation });
  });

  form.addEventListener('equisoul:form-start', () => {
    if (canMeasure()) queue.push({ event: 'form_start', form_id: form.id });
  });
  form.addEventListener('equisoul:form-success', () => {
    if (canMeasure(true)) queue.push({ event: 'lead_success', form_id: form.id });
  });
})();
