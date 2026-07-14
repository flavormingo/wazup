import { useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { useChannelsStore } from '../stores/channels';
import { useClubsStore } from '../stores/clubs';
import { useModalStore } from '../stores/modal';
import { useSectionsStore } from '../stores/sections';
import { Modal } from './Modal';
import './CreateChannelModal.css';

const EMPTY: any[] = [];

export function CreateChannelModal() {
  const close = useModalStore((s) => s.close);
  const clubId = useModalStore((s) => s.modalClubId);
  const initialType = useModalStore((s) => s.modalChannelType);
  const initialSectionId = useModalStore((s) => s.modalSectionId);
  const clubs = useClubsStore((s) => s.clubs);
  const sections = useSectionsStore((s) => s.sections[clubId!] ?? EMPTY);
  const navigate = useNavigate();
  const [type, setType] = useState<'text' | 'voice'>(initialType || 'text');
  const [name, setName] = useState('');
  const [sectionId, setSectionId] = useState<string>(initialSectionId || '');
  const [error, setError] = useState('');

  if (!clubId) return null;
  const club = clubs.find((c) => c.id === clubId);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError('');
    try {
      const data: any = { name: trimmed, type };
      if (sectionId) data.section_id = sectionId;
      const channel = await api.createChannel(clubId, data);
      useChannelsStore.getState().addChannel(channel);
      if (channel.type === 'text' && club) {
        navigate(`/club/${club.slug}/channel/${channel.id}`);
      }
      close();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Modal onClose={close} label="create channel" className="create-channel-modal">
      <h3 className="title">create channel</h3>
      <div className="type-tabs">
        <button className={`type-tab ${type === 'text' ? 'active' : ''}`} onClick={() => setType('text')}>text</button>
        <button className={`type-tab ${type === 'voice' ? 'active' : ''}`} onClick={() => setType('voice')}>voice</button>
      </div>
      <input
        className="input"
        placeholder="channel-name"
        value={name}
        onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        autoFocus
      />
      {sections.length > 0 && (
        <select className="input section-select" value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
          <option value="">no section</option>
          {sections.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      )}
      {error && <p className="modal-error">{error}</p>}
      <div className="actions">
        <button className="btn btn-secondary" onClick={close}>cancel</button>
        <button className="btn btn-primary" onClick={handleCreate}>create</button>
      </div>
    </Modal>
  );
}
