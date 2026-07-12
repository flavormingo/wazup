import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../lib/api';
import { XIcon, SearchIcon, LinkIcon, CheckIcon } from './icons';
import './InviteModal.css';

interface Props {
  clubId: string;
  onClose: () => void;
}

export function InviteModal({ clubId, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await api.searchUsers(searchQuery.trim());
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      }
      setSearching(false);
    }, 300);
  }, [searchQuery]);

  const handleCopyLink = async () => {
    try {
      const invite = await api.createInvite(clubId);
      await navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.code}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSendInvite = async (userId: string) => {
    setSendingTo(userId);
    setError('');
    try {
      await api.sendInviteDm(clubId, userId);
      setSentTo((prev) => new Set(prev).add(userId));
    } catch (e: any) {
      setError(e.message);
    }
    setSendingTo(null);
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="invite" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h2>invite people</h2>
          <button className="modal-close" onClick={onClose}>
            <XIcon size={18} />
          </button>
        </div>

        <div className="section">
          <div className="search-wrap">
            <SearchIcon size={14} className="search-icon" />
            <input
              className="search-input"
              placeholder="search by name"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setError(''); }}
              autoFocus
            />
          </div>

          {searchResults.length > 0 && (
            <div className="results">
              {searchResults.map((u) => (
                <div key={u.id} className="result">
                  <div className="avatar">
                    {u.avatar_url ? <img src={u.avatar_url} alt="" /> : <span>{u.name[0]?.toUpperCase()}</span>}
                  </div>
                  <span className="name">{u.name}</span>
                  {sentTo.has(u.id) ? (
                    <span className="sent-badge"><CheckIcon size={14} /> sent</span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSendInvite(u.id)}
                      disabled={sendingTo === u.id}
                    >
                      {sendingTo === u.id ? '...' : 'invite'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {searching && <div className="searching">searching...</div>}
          {error && <div className="error">{error}</div>}
        </div>

        <div className="divider" />

        <div className="link-section">
          <span className="label">or share an invite link</span>
          <button className="btn btn-secondary copy-btn" onClick={handleCopyLink}>
            <LinkIcon size={14} />
            {linkCopied ? 'copied!' : 'copy link'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
