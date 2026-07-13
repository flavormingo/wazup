interface Flavor {
  logo: string;
  body: string;
  files: string[];
}

declare global {
  interface Window {
    __FLAVORS?: Flavor[];
  }
}

const FLAVORS: Flavor[] = window.__FLAVORS ?? [
  { logo: "'Snah', sans-serif", body: "'Hanken Grotesk', -apple-system, BlinkMacSystemFont, sans-serif", files: ['/fonts/snah.woff2', '/fonts/hkgrotesk.woff2'] },
];

export const FLAVOR_NAMES = ['classic', 'jagged', 'bouncy', 'neon'];

function applyFlavor(index: number) {
  const f = FLAVORS[index];
  document.documentElement.style.setProperty('--font', f.body);
  document.documentElement.style.setProperty('--font-logo', f.logo);
}

function storedFlavorIndex(): number {
  const n = Math.floor(Number(localStorage.getItem('flavor') ?? 0)) % FLAVORS.length;
  return n >= 0 ? n : 0;
}

export function initFlavor() {
  applyFlavor(storedFlavorIndex());
}

export function cycleFlavor(): string {
  const next = (storedFlavorIndex() + 1) % FLAVORS.length;
  localStorage.setItem('flavor', String(next));
  applyFlavor(next);
  return FLAVOR_NAMES[next] ?? `flavor ${next + 1}`;
}

export interface Theme {
  name: string;
  label: string;
  accent: string;
  gradient: string;
}

export const THEMES: Theme[] = [
  { name: 'berkeley', label: 'Berkeley', accent: '#FFC72C', gradient: 'linear-gradient(135deg, #FFC72C, #1C2A56)' },
  { name: 'boulder', label: 'Boulder', accent: '#5B8C5A', gradient: 'linear-gradient(135deg, #5B8C5A, #C4A86B)' },
  { name: 'charlottesville', label: 'Charlottesville', accent: '#F47B20', gradient: 'linear-gradient(135deg, #F47B20, #1A2744)' },
  { name: 'houston', label: 'Houston', accent: '#C000DE', gradient: 'linear-gradient(135deg, #C000DE, #6B21A8)' },
  { name: 'louisville', label: 'Louisville', accent: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626, #7F1D1D)' },
  { name: 'new-orleans', label: 'New Orleans', accent: '#9B59B6', gradient: 'linear-gradient(135deg, #9B59B6, #D4A843)' },
  { name: 'seattle', label: 'Seattle', accent: '#4A9EE8', gradient: 'linear-gradient(135deg, #4A9EE8, #7BBCE8)' },
  { name: 'tucson', label: 'Tucson', accent: '#E07C4C', gradient: 'linear-gradient(135deg, #E07C4C, #C2544A)' },
];

export function getTheme(): string {
  return localStorage.getItem('theme') || 'berkeley';
}

export function setTheme(name: string) {
  localStorage.setItem('theme', name);
  document.documentElement.setAttribute('data-theme', name);
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute('data-theme', theme);
}
