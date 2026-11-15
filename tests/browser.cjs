const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = process.env.EQUISOUL_URL || 'http://127.0.0.1:8765';
const root = path.resolve(__dirname, '..');
const results = [];
const key = 'equisoul.consent.v1';
const actions = ['cta_click', 'form_start', 'lead_success'];
const downstream = ['page_view', 'section_view', 'generate_lead', 'Lead'];

async function screenshot(page, group, filename) {
  await page.screenshot({ path: path.join(root, 'dowody', group, filename), animations: 'disabled' });
}

function events(page, event) {
  return page.evaluate(name => window.dataLayer.filter(entry => entry.event === name), event);
}

async function count(page, event, expected) {
  assert.equal((await events(page, event)).length, expected, event);
}

async function choice(page, analytics, marketing) {
  await page.locator('.consent-banner [data-consent-open]').click();
  await page.locator('#allow-analytics').setChecked(analytics);
  await page.locator('#allow-marketing').setChecked(marketing);
  await page.locator('dialog [data-choice="save"]').click();
}

async function fill(page, email = 'test@example.com') {
  await page.locator('#first-name').fill('AlicjaTestowa');
  await page.locator('#email').fill(email);
  await page.locator('#experience').selectOption('none');
}

async function go(page, hash = '') {
  await page.goto(base + '/' + hash);
  await page.locator('#workshop_interest_form fieldset:not([disabled])').waitFor();
}

async function test(browser, id, run, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: 'reduce', ...options });
  const page = await context.newPage();
  const external = [];
  const errors = [];
  const submissions = [];
  await context.route('**/*', async route => {
    const request = route.request();
    if (new URL(request.url()).origin !== new URL(base).origin) {
      external.push(request.url());
      await route.abort();
      return;
    }
    if (request.method() !== 'GET') submissions.push(request.method() + ' ' + request.url());
    await route.continue();
  });
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  try {
    if (id.startsWith('CMP')) {
      await context.route('**/js/config.js', route => route.fulfill({
        contentType: 'application/javascript',
        body: "window.EquiSoulConfig = { consentMode: 'cookiebot', gtmContainerId: '' };"
      }));
    }
    await go(page);
    const actual = await run(page, context);
    assert.deepEqual(external, [], 'Żądania zewnętrzne w projekcie bez identyfikatora GTM');
    assert.deepEqual(submissions, [], 'Niedozwolona transmisja formularza');
    assert.deepEqual(errors, [], 'Błędy konsoli lub wykonania JS');
    results.push({ id, status: 'PASS', actual });
  } catch (error) {
    results.push({ id, status: 'FAIL', actual: error.message });
  } finally {
    await context.close();
  }
}

async function run() {
  const browser = await chromium.launch();
  try {
    await test(browser, 'F01', async page => {
      await page.locator('[data-choice="reject"]').first().click();
      await screenshot(page, 'lp', 'desktop.png');
      for (const [name, hash] of [['Program','workshop_program'], ['Organizacja','organizacja'], ['FAQ','faq']]) {
        await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
        assert.equal(new URL(page.url()).hash, '#' + hash);
      }
      await page.getByRole('link', { name: 'Prywatność', exact: true }).click();
      await page.waitForURL('**/privacy.html');
      assert.equal(await page.locator('h1').textContent(), 'Informacje o prywatności');
      assert.equal(await page.evaluate(() => typeof window.dataLayer), 'undefined');
      return 'Trzy kotwice i podstrona prywatności działają.';
    });
    await test(browser, 'F02/A02', async page => {
      await choice(page, true, false);
      const ids = ['navigation_cta', 'hero_cta', 'bottom_cta'];
      for (const id of ids) {
        await page.locator('#' + id).click();
        assert.equal(new URL(page.url()).hash, '#zgloszenie');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'signup-title');
      }
      const entries = await events(page, 'cta_click');
      assert.deepEqual(entries.map(entry => entry.cta_location), ['navigation', 'hero', 'bottom']);
      assert(entries.every(entry => Object.keys(entry).length === 2));
      return 'Trzy CTA prowadzą do jednego formularza i zachowują odrębne parametry.';
    });
    await test(browser, 'F03', async page => {
      await page.locator('.consent-banner [data-choice="reject"]').click();
      for (const summary of await page.locator('.faq summary').all()) {
        await summary.press('Space');
        assert.equal(await summary.evaluate(node => node.parentElement.open), true);
        await summary.press('Enter');
        assert.equal(await summary.evaluate(node => node.parentElement.open), false);
      }
      assert.equal(await page.locator('.faq summary').count(), 7);
      return '7 pytań otwartych spacją i zamkniętych Enterem.';
    });
    await test(browser, 'F04', async page => {
      await page.locator('.consent-banner [data-choice="reject"]').click();
      for (const width of [320, 390, 768, 1366]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.locator('.menu-toggle').waitFor({ state: width <= 700 ? 'visible' : 'hidden' });
        if (width === 390) {
          await screenshot(page, 'lp', 'mobile.png');
          await page.locator('.menu-toggle').press('Enter');
          await page.locator('.site-nav').waitFor({ state: 'visible' });
          await page.locator('.site-nav a').first().press('Escape');
          await page.locator('.site-nav').waitFor({ state: 'hidden' });
          assert.equal(await page.evaluate(() => document.activeElement.className), 'menu-toggle');
        }
      }
      return '320, 390, 768 i 1366 px bez przewijania poziomego. Menu działa klawiaturą i zwraca fokus.';
    });
    await test(browser, 'F05/F06', async page => {
      await page.locator('.consent-banner [data-choice="reject"]').click();
      await page.locator('#hero_cta').press('Enter');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'first-name');
      await page.keyboard.type('AlicjaTestowa');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'email');
      await page.keyboard.type('test@example.com');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'experience');
      await page.keyboard.press('n');
      assert.notEqual(await page.locator('#experience').inputValue(), '', 'Wybór klawiaturą');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.locator('#form-success').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(() => document.activeElement.id), 'form-success');
      assert.equal(await page.locator('#first-name').inputValue(), '');
      assert.equal(await page.locator('#email').inputValue(), '');
      await count(page, 'lead_success', 1);
      return 'Klawiatura wystarcza przy odmowie lokalnej. Fokus na potwierdzeniu, pola wyczyszczone, jeden lokalny sygnał.';
    });
    await test(browser, 'F07/A04', async page => {
      await choice(page, true, false);
      await page.locator('#first-name').focus();
      await count(page, 'form_start', 0);
      const submit = page.locator('button[type="submit"]');
      await submit.click();
      assert.equal(await page.locator('.field-error:not([hidden])').count(), 3);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'first-name');
      await count(page, 'lead_success', 0);
      await count(page, 'form_start', 0);
      await fill(page, 'zly-adres');
      await submit.click();
      await page.locator('#email-error').waitFor({ state: 'visible' });
      await count(page, 'form_start', 1);
      await count(page, 'lead_success', 0);
      assert.equal(await page.locator('#form-success').isVisible(), false);
      await screenshot(page, 'formularz', 'negatywny.png');
      return 'Puste pola i błędny e-mail mają komunikaty, lead = 0. Fokus i pusta próba nie mierzą startu. Pierwsza edycja daje jeden form_start.';
    });
    await test(browser, 'F08/A05/A06', async page => {
      await choice(page, true, true);
      await page.locator('#hero_cta').click();
      await fill(page);
      await page.locator('button[type="submit"]').dblclick();
      assert.equal(await page.locator('#form-success').isVisible(), true);
      assert.equal(await page.locator('button[type=submit]').isDisabled(), true);
      assert.equal(await page.locator('#form-success p').textContent(), 'Demonstracja zakończona — dane nie zostały wysłane');
      const business = await page.evaluate(names => dataLayer.filter(entry => names.includes(entry.event)), actions);
      assert.deepEqual(business.map(entry => entry.event), ['cta_click', 'form_start', 'lead_success']);
      assert.deepEqual(business.slice(-2), [
        { event: 'form_start', form_id: 'workshop_interest_form' },
        { event: 'lead_success', form_id: 'workshop_interest_form' }
      ]);
      const data = await page.evaluate(() => JSON.stringify({ dl: dataLayer, local: {...localStorage}, session: {...sessionStorage}, url: location.href }));
      assert(!/AlicjaTestowa|test@example\.com/.test(data));
      await screenshot(page, 'formularz', 'sukces.png');
      return 'Po dwukliku jeden lead_success, zgodny komunikat i jawnie zablokowany przycisk. Dane pól nieobecne w dataLayer, URL i pamięci.';
    });
    await test(browser, 'A07', async page => {
      await choice(page, true, false);
      await page.locator('#zgloszenie').evaluate(node => node.scrollIntoView({ behavior: 'instant' }));
      await fill(page);
      await page.locator('button[type="submit"]').click();
      assert.equal(await page.locator('#form-success').isVisible(), true);
      const business = await page.evaluate(names => dataLayer.filter(entry => names.includes(entry.event)), actions);
      assert.deepEqual(business.map(entry => entry.event), ['form_start', 'lead_success']);
      return 'Jeden form_start i lead_success bez kliknięcia CTA.';
    });
    await test(browser, 'A01', async page => {
      await page.goto(base + '/?utm_source=newsletter&utm_medium=email&utm_campaign=projekt1_test');
      await choice(page, true, false);
      await page.locator('#hero_cta').click();
      const url = new URL(page.url());
      assert.equal(url.searchParams.get('utm_source'), 'newsletter');
      assert.equal(url.hash, '#zgloszenie');
      await fill(page);
      await page.locator('button[type=submit]').click();
      for (const event of downstream) await count(page, event, 0);
      return 'Bez ręcznych odsłon i zdarzeń dostawców w dataLayer. CTA zachowuje wejściowe UTM bez dodawania własnych.';
    });
    for (const width of [390, 1366]) {
      await test(browser, 'A03-' + width, async page => {
        await page.locator('.consent-banner [data-choice="reject"]').click();
        const summary = page.locator('#workshop_program_summary');
        assert.equal(await summary.count(), 1);
        await summary.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
        const geometry = await summary.evaluate(node => {
          const r = node.getBoundingClientRect();
          const y = Math.max(0, Math.min(innerHeight, r.bottom) - Math.max(0, r.top));
          const x = Math.max(0, Math.min(innerWidth, r.right) - Math.max(0, r.left));
          return { height: Math.round(r.height), viewport: innerHeight, visible: x * y / (r.width * r.height) };
        });
        assert(geometry.visible >= .5);
        await page.waitForTimeout(2100);
        await count(page, 'section_view', 0);
        return 'Blok ' + geometry.height + ' px w oknie ' + geometry.viewport + ' px; widoczne ' +
          Math.round(geometry.visible * 100) + '%. Brak lokalnego section_view po 2100 ms.';
      }, { viewport: { width, height: width === 390 ? 670 : 900 } });
    }
    await test(browser, 'Z01/Z02', async page => {
      await page.locator('.consent-banner').waitFor({ state: 'visible' });
      assert.equal(await page.evaluate(k => localStorage.getItem(k), key), null);
      await page.locator('.consent-banner [data-choice="reject"]').click();
      await page.reload();
      assert.equal(await page.locator('.consent-banner').isVisible(), false);
      assert.equal(await page.evaluate(k => localStorage.getItem(k), key), '{"analytics":false,"marketing":false}');
      for (const event of actions.concat(downstream)) await count(page, event, 0);
      return 'Panel startuje bez decyzji. Odmowa zachowana po odświeżeniu; brak sieci zewnętrznej.';
    });
    const matrix = [['Z03', true, false], ['Z04', false, true], ['Z05', true, true]];
    for (const [id, analytics, marketing] of matrix) {
      await test(browser, id, async page => {
        if (id === 'Z05') await page.locator('.consent-banner [data-choice="accept"]').click();
        else await choice(page, analytics, marketing);
        await page.reload();
        assert.deepEqual(await page.evaluate(k => JSON.parse(localStorage.getItem(k)), key), { analytics, marketing });
        await fill(page);
        await page.locator('button[type="submit"]').click();
        await count(page, 'form_start', 1);
        await count(page, 'lead_success', 1);
        return 'Zapis po odświeżeniu: analityka ' + analytics + ', marketing ' + marketing + '. Sygnały tylko w lokalnej kolejce.';
      });
    }
    await test(browser, 'Z06', async page => {
      await page.locator('.consent-banner [data-choice="accept"]').click();
      await page.locator('footer [data-consent-open]').click();
      await page.locator('#allow-analytics').uncheck();
      await screenshot(page, 'zgody', 'zmiana-wyboru.png');
      await Promise.all([page.waitForEvent('load'), page.locator('dialog [data-choice="save"]').click()]);
      await count(page, 'page_view', 0);
      assert.equal(await page.evaluate(k => localStorage.getItem(k), key), '{"analytics":false,"marketing":true}');
      await page.locator('footer [data-consent-open]').click();
      await Promise.all([page.waitForEvent('load'), page.locator('dialog [data-choice="reject"]').click()]);
      assert.equal(await page.evaluate(k => localStorage.getItem(k), key), '{"analytics":false,"marketing":false}');
      return 'Wycofanie jednej i obu zgód przeładowuje dokument i zachowuje aktualny stan.';
    });
    await test(browser, 'Z08', async (page, context) => {
      await page.locator('.consent-banner [data-choice="accept"]').click();
      const second = await context.newPage();
      await go(second);
      assert.equal(await second.evaluate(k => localStorage.getItem(k), key), '{"analytics":true,"marketing":true}');
      await page.locator('footer [data-consent-open]').click();
      const secondReload = second.waitForEvent('load');
      await Promise.all([page.waitForEvent('load'), page.locator('dialog [data-choice="reject"]').click()]);
      await secondReload;
      await count(second, 'page_view', 0);
      assert.equal(await second.evaluate(k => localStorage.getItem(k), key), '{"analytics":false,"marketing":false}');
      return 'Wycofanie w jednej karcie aktualizuje i przeładowuje drugą kartę LP.';
    });
    await test(browser, 'Z09', async (page, context) => {
      await page.locator('.consent-banner [data-choice="accept"]').click();
      // Test wymusza wyłącznie błąd zapisu przy zachowaniu istniejącego wyboru.
      await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('test: storage blocked'); }; });
      await page.locator('footer [data-consent-open]').click();
      await Promise.all([page.waitForEvent('load'), page.locator('dialog [data-choice="reject"]').click()]);
      await count(page, 'page_view', 0);
      assert.equal(await page.evaluate(k => localStorage.getItem(k), key), null);
      assert(!page.url().includes('equisoul_privacy_reset'));
      return 'Błąd zapisu przy wycofaniu skutkuje odmową w nowym dokumencie i usuwa poprzedni zapis, gdy pamięć na to pozwala.';
    });
    await test(browser, 'CMP01', async page => {
      assert.equal(await page.locator('.consent-banner').count(), 0);
      assert.equal(await page.locator('footer [data-consent-open]').isVisible(), false);
      await page.locator('#hero_cta').click();
      await fill(page);
      await page.locator('button[type=submit]').click();
      for (const event of actions) await count(page, event, 0);
      assert.equal(await page.locator('#form-success').isVisible(), true);
      await page.evaluate(() => {
        window.Cookiebot = { consent: { statistics: true, marketing: true } };
        dispatchEvent(new Event('CookiebotOnConsentReady'));
      });
      for (const event of actions) await count(page, event, 0);
      return 'Tryb docelowy z pustym ID bez lokalnego panelu; sukces przed zgodą działa, a przyznanie testowego stanu niczego nie odtwarza.';
    });
    for (const [id, statistics, marketing] of [['CMP02', true, false], ['CMP03', false, true]]) {
      await test(browser, id, async page => {
        await page.evaluate(({ statistics, marketing }) => {
          window.renewCount = 0;
          window.Cookiebot = { consent: { statistics, marketing }, renew() { window.renewCount += 1; } };
          dispatchEvent(new Event('CookiebotOnConsentReady'));
        }, { statistics, marketing });
        await page.locator('footer [data-consent-open]').click();
        assert.equal(await page.evaluate(() => renewCount), 1);
        await page.locator('#hero_cta').click();
        await fill(page);
        await page.locator('button[type=submit]').click();
        await count(page, 'cta_click', statistics ? 1 : 0);
        await count(page, 'form_start', statistics ? 1 : 0);
        await count(page, 'lead_success', 1);
        return 'Kontrolka wywołała renew; adapter respektuje podany stan i właściwą kategorię dla lead_success.';
      });
    }
    await test(browser, 'CMP04', async page => {
      await page.addInitScript(() => {
        window.loadCount = Number(sessionStorage.getItem('testLoadCount') || 0) + 1;
        sessionStorage.setItem('testLoadCount', String(window.loadCount));
        document.addEventListener('DOMContentLoaded', () => {
          const granted = window.loadCount === 1;
          window.Cookiebot = { consent: { statistics: granted, marketing: granted } };
          dispatchEvent(new Event('CookiebotOnConsentReady'));
        });
      });
      await page.reload();
      // Przed badanym przeładowaniem inicjalizujemy stan obu kategorii.
      const before = await page.evaluate(() => {
        Object.assign(window.Cookiebot.consent, { statistics: true, marketing: true });
        dispatchEvent(new Event('CookiebotOnConsentReady'));
        return window.loadCount;
      });
      await Promise.all([page.waitForEvent('load'), page.evaluate(() => {
        Object.assign(window.Cookiebot.consent, { statistics: false, marketing: false });
        dispatchEvent(new Event('CookiebotOnConsentReady'));
        dispatchEvent(new Event('CookiebotOnDecline'));
      })]);
      await page.locator('#hero_cta').click();
      assert.equal(await page.evaluate(() => window.loadCount), before + 1);
      await count(page, 'cta_click', 0);
      return 'Dwie notyfikacje cofnięcia dały jedno przeładowanie; w nowym dokumencie odmowa nie wywołała kolejnego.';
    });
  } finally {
    const report = { environment: 'Chromium ' + browser.version(), url: base, executed_at: new Date().toISOString(), scope: 'Tryb lokalny i adapter Cookiebot z testowymi obiektami API, bez GTM i bez identyfikatorów usług. Sieć zewnętrzna przechwytywana. Odbiór dostawców i Element Visibility wymagają osobnych testów.', results };
    await fs.writeFile(path.join(root, 'dowody', 'wyniki-lokalne.json'), JSON.stringify(report, null, 2) + '\n');
    console.table(results);
    await browser.close();
  }
  if (results.some(result => result.status === 'FAIL')) process.exitCode = 1;
}
run().catch(error => { console.error(error); process.exitCode = 1; });
