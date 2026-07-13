import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/auth';
import { api, uploadToPresigned } from '../lib/api';
import { ImageUploadIcon, FaceSmileIcon, LocationIcon, GlobalLinkIcon, XIcon } from './icons';
import { EmojiPicker } from './EmojiPicker';
import { Modal } from './Modal';
import './CreateProfileModal.css';

interface Props {
  onClose: () => void;
}

export function CreateProfileModal({ onClose }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(currentUser?.name || '');
  const [statusEmoji, setStatusEmoji] = useState('');
  const [statusText, setStatusText] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [pendingAvatarKey, setPendingAvatarKey] = useState<string | null>(null);
  const [pendingBannerKey, setPendingBannerKey] = useState<string | null>(null);

  const bioRef = useRef<HTMLTextAreaElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = 'auto';
      bioRef.current.style.height = bioRef.current.scrollHeight + 'px';
    }
  }, [bio]);

  const handleImageUpload = async (file: File, type: 'avatar' | 'banner') => {
    const previewUrl = URL.createObjectURL(file);
    if (type === 'avatar') setAvatarPreview(previewUrl);
    else setBannerPreview(previewUrl);

    try {
      const result = await api.presignProfileImage({
        type,
        filename: file.name,
        content_type: file.type,
        size: file.size,
      });
      await uploadToPresigned(result, file);
      if (type === 'avatar') setPendingAvatarKey(result.key);
      else setPendingBannerKey(result.key);
    } catch {
      if (type === 'avatar') setAvatarPreview(null);
      else setBannerPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file, type);
    e.target.value = '';
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const data: any = {
        name: name || '',
        status_emoji: statusEmoji || '',
        status_text: statusText || '',
        bio: bio || '',
        location: location || '',
        link: link || '',
      };
      if (pendingAvatarKey) data.avatar_key = pendingAvatarKey;
      if (pendingBannerKey) data.banner_key = pendingBannerKey;
      await updateProfile(data);
      onClose();
    } catch {
      setSaving(false);
    }
  };

  const displayAvatar = avatarPreview || currentUser?.avatar_url;

  return (
    <Modal onClose={onClose} label="create your profile" bare className="profile create-profile">
      <div
        className="banner"
        style={bannerPreview ? { backgroundImage: `url(${bannerPreview})` } : undefined}
      >
        <div className="upload-overlay" onClick={() => bannerInputRef.current?.click()}>
          <ImageUploadIcon size={24} />
          <span>upload banner</span>
        </div>
      </div>

      <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'banner')} />
      <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFileChange(e, 'avatar')} />

      <div className="avatar-section">
        <div className="avatar-lg" onClick={() => avatarInputRef.current?.click()}>
          {displayAvatar ? (
            <img src={displayAvatar} alt="" />
          ) : (
            <span>{(currentUser?.name || '?')[0].toUpperCase()}</span>
          )}
          <div className="avatar-upload">
            <ImageUploadIcon size={20} />
          </div>
        </div>
      </div>

      <div className="cp-form">
        <input
          className="edit-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={32}
          placeholder="your name"
        />

        <div className="status">
          <div className="emoji-wrap">
            <button
              className={`emoji-btn${statusEmoji ? '' : ' empty'}`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              type="button"
            >
              {statusEmoji || <FaceSmileIcon size={16} />}
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onSelect={(e) => { setStatusEmoji(e); setShowEmojiPicker(false); }}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>
          <input
            className="status-input"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            maxLength={30}
            placeholder="set a status..."
          />
          {(statusEmoji || statusText) && (
            <button
              className="status-clear"
              type="button"
              onClick={() => { setStatusEmoji(''); setStatusText(''); }}
            >
              <XIcon size={10} />
            </button>
          )}
        </div>

        <div className="bio-wrap">
          <textarea
            ref={bioRef}
            className="bio-edit"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={200}
            placeholder="tell us about yourself"
          />
          <span className="bio-counter">{bio.length}/200</span>
        </div>

        <div className="meta-field">
          <LocationIcon size={12} />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={100}
            placeholder="location"
          />
        </div>

        <div className="meta-field">
          <GlobalLinkIcon size={12} />
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            maxLength={256}
            placeholder="https://yoursite.com"
          />
        </div>

        <button className="btn btn-primary cp-finish" onClick={handleFinish} disabled={saving}>
          {saving ? '...' : 'finish'}
        </button>
        <button className="cp-skip" onClick={onClose} type="button">
          skip for now
        </button>
      </div>
    </Modal>
  );
}
