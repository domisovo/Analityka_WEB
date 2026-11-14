(() => {
  'use strict';

  if (document.body.dataset.page !== 'workshop') return;

  const queue = window.dataLayer = window.dataLayer || [];
  const consent = window.EquiSoulConsent;
  const formId = 'workshop_interest_form';
  const program = document.getElementById('workshop_program');
  const page = Object.freeze({
    page_location: location.origin + location.pathname,
    page_title: document.title
  });

  let loaded = false;
  let analyticsReady = false;
  let marketingReady = false;
  let previous = null;
  let programSeen = false;
  let timer = null;
  let frame = null;

  function push(event, parameters = {}) {
    queue.push({ event, ...parameters });
  }

  function loadContainer() {
    const id = window.EquiSoulConfig.gtmContainerId;
    if (loaded || !/^GTM-[A-Z0-9]+$/.test(id)) return;
    loaded = true;
    queue.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    document.head.append(script);
  }

  function programInView() {
    if (document.hidden || document.querySelector('.consent-dialog[open]')) return false;
    const bounds = program.getBoundingClientRect();
    const viewportHeight = document.documentElement.clientHeight;
    const visible = Math.min(bounds.bottom, viewportHeight) - Math.max(bounds.top, 0);
    return viewportHeight > 0 && visible >= Math.min(bounds.height, viewportHeight) * .5;
  }

  function checkProgram() {
    if (programSeen || !consent.get().analytics || !programInView()) {
      clearTimeout(timer);
      timer = null;
      return;
    }
    if (timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      if (!consent.get().analytics || !programInView()) return;
      programSeen = true;
      push('section_view', { section_id: program.id });
      observer?.disconnect();
      sizeObserver?.disconnect();
      window.removeEventListener('scroll', scheduleProgramCheck);
      window.removeEventListener('resize', scheduleProgramCheck);
      document.removeEventListener('visibilitychange', checkProgram);
    }, 1000);
  }

  function scheduleProgramCheck() {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      checkProgram();
    });
  }

  // Obserwacja pozycji i zmian rozmiaru. Scroll sprawdza także progi zależne od wysokości ekranu.
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(scheduleProgramCheck) : null;
  const sizeObserver = 'ResizeObserver' in window ? new ResizeObserver(scheduleProgramCheck) : null;
  observer?.observe(program);
  sizeObserver?.observe(program);
  window.addEventListener('scroll', scheduleProgramCheck, { passive: true });
  window.addEventListener('resize', scheduleProgramCheck);
  document.addEventListener('visibilitychange', checkProgram);
  const dialog = document.querySelector('.consent-dialog');
  new MutationObserver(checkProgram).observe(dialog, { attributes: true, attributeFilter: ['open'] });

  function applyConsent(choice) {
    if (previous?.analytics === choice.analytics && previous?.marketing === choice.marketing) return;
    previous = choice;
    if (choice.analytics || choice.marketing) loadContainer();
    push('equisoul_consent_update', {
      consent_analytics: choice.analytics,
      consent_marketing: choice.marketing
    });

    if (choice.analytics && !analyticsReady) {
      analyticsReady = true;
      push('equisoul_analytics_ready', page);
      push('page_view', page);
    }
    if (choice.marketing && !marketingReady) {
      marketingReady = true;
      push('equisoul_marketing_ready', page);
    }
    checkProgram();
  }

  consent.subscribe(applyConsent);
  applyConsent(consent.get());

  const ctaText = 'Zgłoś zainteresowanie';
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-cta-location]');
    if (!button || !consent.get().analytics) return;
    push('cta_click', { cta_id: button.id, cta_location: button.dataset.ctaLocation, cta_text: ctaText });
  });

  const form = document.getElementById(formId);
  form.addEventListener('equisoul:form-start', () => {
    if (consent.get().analytics) push('form_start', { form_id: formId });
  });
  form.addEventListener('equisoul:form-success', () => {
    const { analytics, marketing } = consent.get();
    if (analytics || marketing) push('generate_lead', { form_id: formId });
  });
})();
