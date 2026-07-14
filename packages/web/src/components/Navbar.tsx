import { useRef } from 'react';
import { useAuthStore } from '../stores/auth';
import { useFriendsStore } from '../stores/friends';
import { cycleFlavor } from '../lib/themes';
import { toast } from '../stores/toast';
import { UsersIcon, FlaskIcon } from './icons';
import './Navbar.css';

interface Props {
  onFriendsClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
}

export function Navbar({ onFriendsClick, onProfileClick, onSettingsClick }: Props) {
  const user = useAuthStore((s) => s.user);
  const incoming = useFriendsStore((s) => s.incoming);
  const logoRef = useRef<HTMLSpanElement>(null);

  const handleLogo = () => {
    const name = cycleFlavor();
    toast.info(`flavor: ${name}`);
    const el = logoRef.current;
    if (el) {
      el.classList.remove('wiggling');
      void el.offsetWidth;
      el.classList.add('wiggling');
    }
  };

  return (
    <nav className="navbar">
      <div className="left">
        <button className="avatar-btn avatar" onClick={onProfileClick} aria-label="profile">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" />
          ) : (
            <span className="letter">{user?.name?.[0]?.toUpperCase() || '?'}</span>
          )}
        </button>
      </div>
      <div className="center">
        <span className="logo" ref={logoRef} onClick={handleLogo}>wazup</span>
      </div>
      <div className="right">
        <button className="icon-btn" onClick={onFriendsClick} aria-label="friends">
          <UsersIcon size={18} />
          {incoming.length > 0 && <span className="badge dot-badge" />}
        </button>
        <button className="icon-btn" onClick={onSettingsClick} aria-label="settings">
          <FlaskIcon size={18} />
        </button>
      </div>
    </nav>
  );
}
