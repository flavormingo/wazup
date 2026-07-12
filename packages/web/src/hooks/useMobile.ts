import { useSyncExternalStore } from 'react';

const query = '(max-width: 768px)';

function subscribe(cb: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getSnapshot() {
  return window.matchMedia(query).matches;
}

export function useMobile() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
