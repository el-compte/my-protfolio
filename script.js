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
