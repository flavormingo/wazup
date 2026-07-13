import { useLightboxStore } from '../stores/lightbox';
import { Modal } from './Modal';
import './Lightbox.css';

export function Lightbox() {
  const src = useLightboxStore((s) => s.src);
  const alt = useLightboxStore((s) => s.alt);
  const close = useLightboxStore((s) => s.close);

  if (!src) return null;

  return (
    <Modal onClose={close} label="image preview" bare className="lightbox" overlayClassName="lightbox-overlay">
      <img src={src} alt={alt} onClick={close} />
    </Modal>
  );
}
