import { useEffect, useRef, type RefObject } from 'react';

export function useOutsideClose<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClose: () => void,
  active = true,
) {
  const cb = useRef(onClose);
  cb.current = onClose;

  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb.current();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cb.current();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, active]);
}
