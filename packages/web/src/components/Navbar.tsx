import { useAuthStore } from '../stores/auth';
import { useFriendsStore } from '../stores/friends';
import { cycleFlavor } from '../lib/themes';
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

  return (
    <nav className="navbar">
      <div className="left">
        <button className="avatar-btn" onClick={onProfileClick} title="profile">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="" />
          ) : (
            <span className="letter">{user?.name?.[0]?.toUpperCase() || '?'}</span>
          )}
        </button>
      </div>
      <div className="center">
        <span className="logo" onClick={cycleFlavor}>wazup</span>
      </div>
      <div className="right">
        <button className="btn" onClick={onFriendsClick} title="friends">
          <UsersIcon size={18} />
          {incoming.length > 0 && <span className="badge" />}
        </button>
        <button className="btn" onClick={onSettingsClick} title="settings">
          <FlaskIcon size={18} />
        </button>
      </div>
    </nav>
  );
}
