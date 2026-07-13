import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const stack: symbol[] = [];

interface Props {
  onClose: () => void;
  label: string;
  className?: string;
  overlayClassName?: string;
  bare?: boolean;
  children: ReactNode;
}

export function Modal({ onClose, label, className, overlayClassName, bare, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const downOnOverlay = useRef(false);

  useEffect(() => {
    const id = Symbol();
    stack.push(id);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const el = ref.current;

    if (el && !el.contains(document.activeElement)) {
      el.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== id) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key === 'Tab' && el) {
        const focusables = Array.from(
          el.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled):not([hidden]), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter((f) => (f.checkVisibility ? f.checkVisibility() : f.offsetParent !== null));
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (idx === -1 || idx === focusables.length - 1)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      stack.splice(stack.indexOf(id), 1);
      previouslyFocused?.focus?.();
    };
  }, []);

  return createPortal(
    <div
      className={`modal-overlay ${overlayClassName ?? ''}`}
      onMouseDown={(e) => {
        downOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnOverlay.current && e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={bare ? (className ?? '') : `modal ${className ?? ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
