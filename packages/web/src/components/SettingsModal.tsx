import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { authClient } from '../lib/authClient';
import { api } from '../lib/api';
import { THEMES, getTheme, setTheme } from '../lib/themes';
import {
  getTimeFormat, setTimeFormat, type TimeFormat,
  getFriendPrivacy, setFriendPrivacy, type FriendPrivacy,
  getHighContrast, setHighContrast,
} from '../lib/preferences';
import { XIcon, SignOutIcon } from './icons';
import './SettingsModal.css';

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

function Dropdown<T extends string>({ value, options, onChange }: {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={`dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button className="trigger" onClick={() => setOpen(!open)}>
        <span>{selected?.label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="menu">
          {options.map((o) => (
            <button
              key={o.value}
              className={`item ${o.value === value ? 'active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type Tab = 'account' | 'chat' | 'style' | 'yikes';

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const { logout } = useAuthStore();
  const [tab, setTab] = useState<Tab>('account');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar">
          <div className="title">settings</div>
          <button
            className={`tab ${tab === 'account' ? 'active' : ''}`}
            onClick={() => setTab('account')}
          >
            account
          </button>
          <button
            className={`tab ${tab === 'chat' ? 'active' : ''}`}
            onClick={() => setTab('chat')}
          >
            chat
          </button>
          <button
            className={`tab ${tab === 'style' ? 'active' : ''}`}
            onClick={() => setTab('style')}
          >
            style
          </button>
          <button
            className={`tab ${tab === 'yikes' ? 'active' : ''}`}
            onClick={() => setTab('yikes')}
          >
            yikes
          </button>
          <div className="divider" />
          <button className="tab danger" onClick={handleLogout}>
            <SignOutIcon size={16} /> log out
          </button>
        </div>
        <div className="content">
          <div className="header">
            <h2>{tab}</h2>
            <button className="modal-close" onClick={onClose}>
              <XIcon size={18} />
            </button>
          </div>
          {tab === 'account' && <AccountTab />}
          {tab === 'chat' && <ChatTab />}
          {tab === 'style' && <StyleTab />}
          {tab === 'yikes' && <YikesTab />}
        </div>
      </div>
    </div>
  );
}

function AccountTab() {
  const user = useAuthStore((s) => s.user);

  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [friendPrivacy, setFriendPrivacyState] = useState<FriendPrivacy>(getFriendPrivacy());

  const [showDelete, setShowDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangeEmail = async () => {
    setEmailError('');
    setEmailSuccess('');
    if (!newEmail.trim()) return;
    setEmailLoading(true);
    try {
      const { error } = await authClient.changeEmail({ newEmail: newEmail.trim() });
      if (error) { setEmailError(error.message || 'failed to change email'); return; }
      setEmailSuccess('verification sent');
      setNewEmail('');
    } catch (err: any) {
      setEmailError(err.message || 'failed to change email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentPassword) { setPasswordError('enter your current password'); return; }
    if (!newPassword) { setPasswordError('enter a new password'); return; }
    if (newPassword.length < 8) { setPasswordError('must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('passwords do not match'); return; }
    setPasswordLoading(true);
    try {
      const { error } = await authClient.changePassword({ currentPassword, newPassword });
      if (error) { setPasswordError(error.message || 'failed to change password'); return; }
      setPasswordSuccess('password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (!deletePassword) { setDeleteError('enter your password'); return; }
    setDeleteLoading(true);
    try {
      const { error } = await authClient.deleteUser({ password: deletePassword });
      if (error) { setDeleteError(error.message || 'failed to delete account'); return; }
      window.location.reload();
    } catch (err: any) {
      setDeleteError(err.message || 'failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFriendPrivacyChange = (value: FriendPrivacy) => {
    setFriendPrivacyState(value);
    setFriendPrivacy(value);
  };

  return (
    <>
      <div className="section">
        <div className="title">email</div>
        <div className="field-value">{user?.email}</div>
        <div className="row">
          <input
            className="input"
            type="email"
            placeholder="new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChangeEmail()}
          />
          <button
            className="btn btn-primary"
            onClick={handleChangeEmail}
            disabled={emailLoading || !newEmail.trim()}
          >
            {emailLoading ? 'saving...' : 'save'}
          </button>
        </div>
        {emailError && <div className="error">{emailError}</div>}
        {emailSuccess && <div className="success">{emailSuccess}</div>}
      </div>

      <div className="section">
        <div className="title">password</div>
        <div className="stack">
          <input
            className="input"
            type="password"
            placeholder="current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="row">
            <input
              className="input"
              type="password"
              placeholder="confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
            />
            <button
              className="btn btn-primary"
              onClick={handleChangePassword}
              disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
            >
              {passwordLoading ? 'saving...' : 'save'}
            </button>
          </div>
        </div>
        {passwordError && <div className="error">{passwordError}</div>}
        {passwordSuccess && <div className="success">{passwordSuccess}</div>}
      </div>

      <div className="section">
        <div className="title">friend requests</div>
        <Dropdown
          value={friendPrivacy}
          options={[
            { value: 'everyone', label: 'everyone' },
            { value: 'friends-of-friends', label: 'friends of friends' },
            { value: 'club-members', label: 'club members' },
          ]}
          onChange={handleFriendPrivacyChange}
        />
      </div>

      <div className="section">
        <div className="danger-zone">
          <div className="title">delete account</div>
          {!showDelete ? (
            <button
              className="btn btn-danger"
              onClick={() => setShowDelete(true)}
            >
              delete my account
            </button>
          ) : (
            <>
              <div className="error" style={{ marginBottom: 8 }}>this is permanent. all your data will be deleted.</div>
              <div className="row">
                <input
                  className="input"
                  type="password"
                  placeholder="enter your password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDeleteAccount()}
                />
                <button className="btn btn-ghost" onClick={() => setShowDelete(false)}>
                  cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || !deletePassword}
                >
                  {deleteLoading ? 'deleting...' : 'confirm'}
                </button>
              </div>
              {deleteError && <div className="error">{deleteError}</div>}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function ChatTab() {
  const [timeFormat, setTimeFormatState] = useState<TimeFormat>(getTimeFormat());

  const handleTimeFormat = (format: TimeFormat) => {
    setTimeFormatState(format);
    setTimeFormat(format);
  };

  return (
    <>
      <div className="section">
        <div className="title">language</div>
        <Dropdown
          value="en"
          options={[{ value: 'en', label: 'english' }]}
          onChange={() => {}}
        />
      </div>

      <div className="section">
        <div className="title">time format</div>
        <Dropdown
          value={timeFormat}
          options={[
            { value: '12h', label: '12-hour' },
            { value: '24h', label: '24-hour' },
          ]}
          onChange={handleTimeFormat}
        />
      </div>
    </>
  );
}

function StyleTab() {
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const [highContrast, setHighContrastState] = useState(getHighContrast());

  const handleThemeSelect = (name: string) => {
    setCurrentTheme(name);
    setTheme(name);
  };

  const handleHighContrast = () => {
    const next = !highContrast;
    setHighContrastState(next);
    setHighContrast(next);
  };

  return (
    <>
      <div className="section">
        <div className="title">theme</div>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.name}
              className={`card ${currentTheme === t.name ? 'active' : ''}`}
              onClick={() => handleThemeSelect(t.name)}
            >
              <div className="swatch" style={{ background: t.gradient }} />
              <span className="label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="title">app icon</div>
        <div className="coming-soon">coming soon</div>
      </div>

      <div className="section">
        <div className="title">accessibility</div>
        <div className="field">
          <span className="label">high contrast</span>
          <button
            className={`toggle ${highContrast ? 'on' : ''}`}
            onClick={handleHighContrast}
          />
        </div>
      </div>
    </>
  );
}

function YikesTab() {
  const [bugText, setBugText] = useState('');
  const [bugStatus, setBugStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [bugError, setBugError] = useState('');

  const [actorText, setActorText] = useState('');
  const [actorStatus, setActorStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [actorError, setActorError] = useState('');

  const handleBugReport = async () => {
    if (!bugText.trim()) return;
    setBugStatus('sending');
    setBugError('');
    try {
      await api.sendReport({ type: 'bug', message: bugText.trim() });
      setBugStatus('sent');
      setBugText('');
    } catch (err: any) {
      setBugStatus('error');
      setBugError(err.message || 'failed to send report');
    }
  };

  const handleActorReport = async () => {
    if (!actorText.trim()) return;
    setActorStatus('sending');
    setActorError('');
    try {
      await api.sendReport({ type: 'actor', message: actorText.trim() });
      setActorStatus('sent');
      setActorText('');
    } catch (err: any) {
      setActorStatus('error');
      setActorError(err.message || 'failed to send report');
    }
  };

  return (
    <>
      <div className="section">
        <div className="title">report a bug</div>
        <textarea
          placeholder="describe the bug..."
          value={bugText}
          onChange={(e) => setBugText(e.target.value)}
        />
        <div className="actions">
          {bugStatus === 'sent' && <span className="success">sent!</span>}
          {bugStatus === 'error' && <span className="error">{bugError}</span>}
          <button
            className="btn btn-primary"
            onClick={handleBugReport}
            disabled={bugStatus === 'sending' || !bugText.trim()}
          >
            {bugStatus === 'sending' ? 'sending...' : 'send'}
          </button>
        </div>
      </div>

      <div className="section">
        <div className="title">report a bad actor</div>
        <textarea
          placeholder="describe the situation..."
          value={actorText}
          onChange={(e) => setActorText(e.target.value)}
        />
        <div className="actions">
          {actorStatus === 'sent' && <span className="success">sent!</span>}
          {actorStatus === 'error' && <span className="error">{actorError}</span>}
          <button
            className="btn btn-primary"
            onClick={handleActorReport}
            disabled={actorStatus === 'sending' || !actorText.trim()}
          >
            {actorStatus === 'sending' ? 'sending...' : 'send'}
          </button>
        </div>
      </div>
    </>
  );
}
