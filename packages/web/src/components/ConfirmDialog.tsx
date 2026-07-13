import { createPortal } from 'react-dom';

interface Props {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'confirm', cancelLabel = 'cancel', danger, onConfirm, onCancel }: Props) {
  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="title">{title}</h3>
        {message && <p className="modal-message">{message}</p>}
        <div className="actions">
          {cancelLabel !== '' && <button className="btn btn-secondary" onClick={onCancel} autoFocus={danger}>{cancelLabel}</button>}
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} autoFocus={!danger || cancelLabel === ''}>{confirmLabel}</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
