import { createPortal } from 'react-dom';
import { useToastStore } from '../stores/toast';
import './Toaster.css';

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return createPortal(
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={`toast ${t.type}`} onClick={() => dismiss(t.id)}>
          <span className="dot" />
          <span className="msg">{t.message}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}
