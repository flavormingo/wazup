import { useState } from 'react';
import { api } from '../lib/api';
import { useSectionsStore } from '../stores/sections';
import { useModalStore } from '../stores/modal';
import { Modal } from './Modal';
import './CreateSectionModal.css';

export function CreateSectionModal() {
  const close = useModalStore((s) => s.close);
  const clubId = useModalStore((s) => s.modalClubId);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!clubId) return null;

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError('');
    try {
      const section = await api.createSection(clubId, { name: trimmed });
      useSectionsStore.getState().addSection(section);
      close();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Modal onClose={close} label="create section" className="create-section-modal">
      <h3 className="title">create section</h3>
      <input
        className="input"
        placeholder="section name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        autoFocus
        maxLength={100}
      />
      {error && <p className="modal-error">{error}</p>}
      <div className="actions">
        <button className="btn btn-secondary" onClick={close}>cancel</button>
        <button className="btn btn-primary" onClick={handleCreate}>create</button>
      </div>
    </Modal>
  );
}
