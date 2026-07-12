import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { api, uploadToPresigned } from '../lib/api';
import { useClubsStore } from '../stores/clubs';
import { useModalStore } from '../stores/modal';
import './EditClubModal.css';

export function EditClubModal() {
  const close = useModalStore((s) => s.close);
  const clubId = useModalStore((s) => s.modalClubId);
  const clubs = useClubsStore((s) => s.clubs);
  const updateClub = useClubsStore((s) => s.updateClub);
  const club = clubs.find((c) => c.id === clubId);

  const [name, setName] = useState(club?.name || '');
  const [slug, setSlug] = useState(club?.slug || '');
  const [iconPreview, setIconPreview] = useState<string | null>(club?.icon_url || null);
  const [iconKey, setIconKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!clubId || !club) return null;

  const handleIconSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const presign = await api.presignClubIcon(clubId, {
        filename: file.name,
        content_type: file.type,
        size: file.size,
      });
      await uploadToPresigned(presign, file);
      setIconKey(presign.key);
      setIconPreview(presign.public_url);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const data: any = {};
      if (name.trim() !== club.name) data.name = name.trim();
      if (slug !== club.slug) data.slug = slug;
      if (iconKey) data.icon_key = iconKey;
      const updated = await api.updateClub(clubId, data);
      updateClub(clubId, updated);
      if (data.slug && data.slug !== club.slug) {
        navigate(`/club/${updated.slug}`, { replace: true });
      }
      close();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const initials = club.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return createPortal(
    <div className="modal-overlay" onClick={close}>
      <div className="modal edit-club-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="title">edit club</h3>

        <input type="file" ref={fileRef} accept="image/*" hidden onChange={handleIconSelect} />
        <div className="icon-upload" onClick={() => fileRef.current?.click()}>
          {iconPreview ? (
            <img src={iconPreview} alt="" />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="field-label">name</div>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
        />

        <div className="field-label">club url</div>
        <div className="slug-row">
          <span className="slug-prefix">wazup.chat/club/</span>
          <input
            className="slug-input"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            maxLength={30}
          />
        </div>

        {error && <p className="modal-error">{error}</p>}
        <div className="actions">
          <button className="btn btn-secondary" onClick={close}>cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'saving...' : 'save'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
