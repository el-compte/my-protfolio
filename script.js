// Light/dark toggle. The choice is remembered per visitor; without it, the system setting wins.
const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

toggle?.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
});

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// Contact form. Messages go to my inbox through Web3Forms (https://web3forms.com).
// The access key is meant to be public; paste it here to turn on sending.
// Without it, the form opens the visitor's email app with the message filled in.
const WEB3FORMS_ACCESS_KEY = '87b81aab-0b73-40e3-8110-e63fa486297d';
const CONTACT_EMAIL = 'ayment64@gmail.com';

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('cf-status');

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = `form-status${kind ? ` is-${kind}` : ''}`;
}

function validate(fields) {
  const problems = [];
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim());
  const checks = [
    [fields.name, fields.name.value.trim().length > 0, 'your name'],
    [fields.email, emailOk, 'a valid email'],
    [fields.message, fields.message.value.trim().length >= 10, 'a message (at least 10 characters)'],
  ];
  for (const [input, ok, label] of checks) {
    input.setAttribute('aria-invalid', String(!ok));
    if (!ok) problems.push(label);
  }
  return problems;
}

function mailtoLink(name, email, topic, message) {
  const subject = `Portfolio: ${topic} (from ${name})`;
  const body = `${message}\n\n${name}\n${email}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fields = form.elements;
  const problems = validate(fields);
  if (problems.length) {
    setStatus(`Please add ${problems.join(', ')}.`, 'error');
    return;
  }

  const name = fields.name.value.trim();
  const email = fields.email.value.trim();
  const topic = fields.topic.value;
  const message = fields.message.value.trim();

  // A bot ticked the hidden box: act as if it worked, send nothing.
  if (fields.botcheck.checked) {
    form.reset();
    setStatus('Thanks! Your message is on its way.', 'success');
    return;
  }

  if (!WEB3FORMS_ACCESS_KEY) {
    window.location.href = mailtoLink(name, email, topic, message);
    setStatus('Your email app should open with the message ready to send.', 'success');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = 'Sending…';
  setStatus('', '');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Portfolio: ${topic} (from ${name})`,
        from_name: 'Portfolio contact form',
        name,
        email,
        topic,
        message,
        botcheck: false,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.message || `HTTP ${response.status}`);
    form.reset();
    setStatus("Thanks! Your message is on its way, and I'll reply soon.", 'success');
  } catch {
    statusEl.className = 'form-status is-error';
    statusEl.innerHTML = '';
    statusEl.append('Sorry, that didn’t go through. ');
    const link = document.createElement('a');
    link.href = mailtoLink(name, email, topic, message);
    link.textContent = 'Send it by email instead';
    statusEl.append(link, '.');
  } finally {
    button.disabled = false;
    button.textContent = 'Send message';
  }
});

// Clear the red outline as soon as someone fixes a field.
form?.addEventListener('input', (event) => {
  if (event.target.getAttribute('aria-invalid') === 'true') {
    event.target.setAttribute('aria-invalid', 'false');
  }
});
