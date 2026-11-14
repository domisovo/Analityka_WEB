(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  const mobile = matchMedia('(max-width: 700px)');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  function syncMenu() {
    toggle.hidden = !mobile.matches;
    setMenu(false);
  }

  header.classList.add('is-enhanced');
  syncMenu();
  mobile.addEventListener('change', syncMenu);
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') === 'false'));

  header.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    const focusTarget = target.querySelector('h2') ?? target;
    focusTarget.setAttribute('tabindex', '-1');
    if (nav.contains(link)) setMenu(false);
    focusTarget.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start' });
  });
})();
