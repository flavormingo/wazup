import { Modal } from './Modal';

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
  return (
    <Modal onClose={onCancel} label={title}>
      <h3 className="title">{title}</h3>
      {message && <p>{message}</p>}
      <div className="actions">
        {cancelLabel !== '' && <button className="btn btn-secondary" onClick={onCancel} autoFocus={danger}>{cancelLabel}</button>}
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} autoFocus={!danger || cancelLabel === ''}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
