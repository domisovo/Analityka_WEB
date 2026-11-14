(() => {
  'use strict';

  const key = 'equisoul.consent.v1';
  const lp = document.body.dataset.page === 'workshop';
  const denied = Object.freeze({ analytics: false, marketing: false });

  function load() {
    try {
      const choice = JSON.parse(localStorage.getItem(key));
      if (typeof choice?.analytics === 'boolean' && typeof choice?.marketing === 'boolean') {
        return Object.freeze({ analytics: choice.analytics, marketing: choice.marketing });
      }
    } catch {
      // Uszkodzony zapis lub blokada pamięci oznaczają domyślną odmowę.
    }
    return null;
  }

  // W przypadku błędu zapisu przy wycofaniu omijamy poprzedni zapis w nowym dokumencie.
  const url = new URL(location.href);
  const reset = url.searchParams.has('equisoul_privacy_reset');
  url.searchParams.delete('equisoul_privacy_reset');
  if (reset) {
    try { localStorage.removeItem(key); } catch { /* Nadal stosujemy odmowę. */ }
    history.replaceState(history.state, '', url);
  }
  let saved = reset ? denied : load();
  let current = saved ?? denied;
  let reloading = false;
  const listeners = new Set();

  function expireCookies(pattern) {
    const names = document.cookie.split(';').map(pair => pair.trim().split('=')[0]);
    const host = location.hostname;
    const domains = ['', ...host.split('.').map((_, index, parts) => parts.slice(index).join('.'))];
    const directories = location.pathname.split('/').slice(0, -1);
    const paths = new Set(['/', ...directories.map((_, index) => directories.slice(0, index + 1).join('/') || '/')]);
    for (const name of names.filter(name => pattern.test(name))) {
      for (const domain of domains) {
        for (const path of paths) {
          document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? '; domain=' + domain : ''}`;
        }
      }
    }
  }

  function stopAnalytics() {
    const measurementId = window.EquiSoulGa4MeasurementId;
    if (typeof measurementId === 'string' && /^G-[A-Z0-9]+$/.test(measurementId)) {
      window['ga-disable-' + measurementId] = true;
    }
    if (typeof window.clarity === 'function') {
      window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
      window.clarity('stop');
    }
    expireCookies(/^(?:_ga(?:_|$)|_clck$|_clsk$)/);
  }

  function stopMarketing() {
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
    expireCookies(/^_fb[pc]$/);
  }

  function apply(next, persisted = true) {
    if (reloading) return;
    const previous = current;
    current = next ?? denied;
    saved = next;
    const lostAnalytics = previous.analytics && !current.analytics;
    const lostMarketing = previous.marketing && !current.marketing;
    if (lostAnalytics) stopAnalytics();
    if (lostMarketing) stopMarketing();
    if (lp && (lostAnalytics || lostMarketing)) {
      reloading = true;
      if (persisted) {
        location.reload();
      } else {
        const destination = new URL(location.href);
        destination.searchParams.set('equisoul_privacy_reset', '1');
        location.replace(destination);
      }
      return;
    }
    for (const listener of listeners) listener(current);
    render();
  }

  function choose(analytics, marketing) {
    const next = Object.freeze({ analytics, marketing });
    let persisted = true;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      persisted = false;
      storageNote.hidden = false;
    }
    dialog.close();
    if (!banner.hidden && banner.contains(document.activeElement)) {
      document.querySelector('main h1').setAttribute('tabindex', '-1');
      document.querySelector('main h1').focus({ preventScroll: true });
    }
    apply(next, persisted);
  }

  // Stałe treści interfejsu. Ustawienia zgód nigdy nie zawierają pól formularza.
  const ui = document.createElement('div');
  ui.innerHTML = `
    <aside class="consent-banner" aria-labelledby="consent-title" data-clarity-mask="True" hidden>
      <div>
        <strong id="consent-title">Twoje ustawienia prywatności</strong>
        <p>Zdecyduj, czy zezwalasz na analitykę i marketing. <a href="privacy.html">Informacje o prywatności</a></p>
      </div>
      <div class="consent-actions">
        <button class="button button-outline" type="button" data-choice="reject">Odrzuć opcjonalne</button>
        <button class="button button-outline" type="button" data-consent-open>Ustawienia</button>
        <button class="button button-solid" type="button" data-choice="accept">Akceptuj wszystkie</button>
      </div>
    </aside>
    <dialog class="consent-dialog" id="consent-dialog" aria-labelledby="consent-settings-title" data-clarity-mask="True">
      <h2 id="consent-settings-title">Ustawienia prywatności</h2>
      <p>Niezbędny zapis pozwala zapamiętać wybór w tej przeglądarce.</p>
      <label class="consent-option"><input type="checkbox" checked disabled> Niezbędne</label>
      <label class="consent-option"><input id="allow-analytics" type="checkbox"> Analityczne <small>Pomiar wizyt i użyteczności przez GA4 i Microsoft Clarity.</small></label>
      <label class="consent-option"><input id="allow-marketing" type="checkbox"> Marketingowe <small>Pomiar i remarketing w Meta Pixel.</small></label>
      <div class="consent-actions">
        <button class="button button-solid" type="button" data-choice="save">Zapisz wybór</button>
        <button class="button button-outline" type="button" data-choice="reject">Odrzuć opcjonalne</button>
        <button class="button button-outline" type="button" data-choice="accept">Akceptuj wszystkie</button>
        <button class="text-button" type="button" data-choice="close">Zamknij</button>
      </div>
    </dialog>
    <p class="wrap" id="consent-storage-note" role="status" hidden>Przeglądarka blokuje zapis ustawień. Wybór może obowiązywać tylko na tej stronie.</p>`;
  document.body.append(ui);
  const banner = ui.querySelector('.consent-banner');
  const dialog = ui.querySelector('dialog');
  const storageNote = ui.querySelector('#consent-storage-note');
  const analytics = ui.querySelector('#allow-analytics');
  const marketing = ui.querySelector('#allow-marketing');

  function render() {
    banner.hidden = saved !== null;
  }

  for (const button of document.querySelectorAll('[data-consent-open]')) {
    button.hidden = false;
    button.addEventListener('click', () => {
      analytics.checked = current.analytics;
      marketing.checked = current.marketing;
      dialog.showModal();
    });
  }

  for (const button of ui.querySelectorAll('[data-choice]')) {
    button.addEventListener('click', () => {
      switch (button.dataset.choice) {
        case 'accept': choose(true, true); break;
        case 'reject': choose(false, false); break;
        case 'save': choose(analytics.checked, marketing.checked); break;
        case 'close': dialog.close(); break;
      }
    });
  }

  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(load());
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) apply(load());
  });

  window.EquiSoulConsent = Object.freeze({
    get: () => current,
    subscribe: listener => listeners.add(listener)
  });
  render();
})();
