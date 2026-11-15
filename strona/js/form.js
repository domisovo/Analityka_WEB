(() => {
  'use strict';

  const form = document.getElementById('workshop_interest_form');
  const success = document.getElementById('form-success');
  const name = document.getElementById('first-name');
  const email = document.getElementById('email');
  const experience = document.getElementById('experience');
  const fields = [name, email, experience];
  const initialValues = new Map(fields.map(field => [field, field.value]));
  const submit = form.querySelector('button[type=submit]');

  let started = false;
  let completed = false;

  function start() {
    if (started || completed) return;
    started = true;
    form.dispatchEvent(new Event('equisoul:form-start'));
  }

  function messageFor(field) {
    if (field === name && !name.value.trim()) return 'Wpisz fikcyjne imię.';
    if (field === email) {
      if (!email.value) return 'Wpisz fikcyjny adres e-mail.';
      if (!email.validity.valid || !/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) {
        return 'Wpisz poprawnie sformatowany adres, np. test@example.com.';
      }
    }
    if (field === experience && !experience.value) return 'Wybierz poziom doświadczenia.';
    return '';
  }

  function validate(field) {
    const message = messageFor(field);
    const error = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    error.hidden = !message;
    return !message;
  }

  function interact(event) {
    if (!event.isTrusted || !fields.includes(event.target)) return;
    if (event.target.value !== initialValues.get(event.target)) start();
    if (event.target.getAttribute('aria-invalid') === 'true') validate(event.target);
  }

  form.addEventListener('input', interact);
  form.addEventListener('change', interact);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (completed) return;
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length > 0) {
      invalid[0].focus();
      return;
    }

    // Jedna konwersja na dokument. Najpierw pokazujemy sukces i czyścimy pola.
    completed = true;
    submit.disabled = true;
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
    form.dispatchEvent(new Event('equisoul:form-success'));
  });
  form.querySelector('fieldset').disabled = false;
})();
