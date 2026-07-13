import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useFriendsStore } from '../stores/friends';
import { useDmsStore } from '../stores/dms';
import { XIcon, SearchIcon, CheckIcon, UserXmarkIcon, MessageTextIcon } from './icons';
import { ConfirmDialog } from './ConfirmDialog';
import { useModalStore } from '../stores/modal';
import './FriendsModal.css';

interface Props {
  onClose: () => void;
}

export function FriendsModal({ onClose }: Props) {
  const {
    friends, incoming, outgoing, loading,
    fetchFriends, fetchPending, sendRequest, acceptRequest, removeFriend,
  } = useFriendsStore();
  const createDm = useDmsStore((s) => s.createDm);
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'pending' | 'add'>('add');
  const [addUsername, setAddUsername] = useState('');
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const openProfile = useModalStore((s) => s.openProfile);

  useEffect(() => {
    fetchFriends();
    fetchPending();
  }, [fetchFriends, fetchPending]);

  const handleAdd = async () => {
    if (!addUsername.trim()) return;
    setAddError('');
    setAddSuccess('');
    setAddLoading(true);
    try {
      const result = await sendRequest(addUsername.trim());
      if (result.status === 'accepted') {
        setAddSuccess(`you are now friends with ${addUsername}!`);
      } else {
        setAddSuccess(`friend request sent to ${addUsername}`);
      }
      setAddUsername('');
    } catch (e: any) {
      setAddError(e.message);
    }
    setAddLoading(false);
  };

  const handleMessage = async (userId: string) => {
    try {
      const dm = await createDm([userId]);
      onClose();
      navigate(`/dm/${dm.id}`);
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const pendingCount = incoming.length + outgoing.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="friends" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h2>friends</h2>
          <button className="modal-close" onClick={onClose}>
            <XIcon size={18} />
          </button>
        </div>

        <div className="tabs" role="tablist">
          <button className="tab" role="tab" aria-selected={tab === 'add'} onClick={() => setTab('add')}>
            add friend
          </button>
          <button className="tab" role="tab" aria-selected={tab === 'pending'} onClick={() => setTab('pending')}>
            pending {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </button>
          <button className="tab" role="tab" aria-selected={tab === 'all'} onClick={() => setTab('all')}>
            all ({friends.length})
          </button>
        </div>

        <div className="content">
          {tab === 'all' && (
            <div className="list">
              {friends.map((f: any) => (
                <div key={f.id} className="item">
                  <div className="avatar" onClick={() => openProfile(f.user.id)} style={{ cursor: 'pointer' }}>
                    {f.user.avatar_url ? (
                      <img src={f.user.avatar_url} alt="" />
                    ) : (
                      <span>{f.user.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="info">
                    <span className="name">{f.user.name}</span>
                  </div>
                  <div className="actions">
                    <button className="action-btn icon-btn" onClick={() => handleMessage(f.user.id)} title="message">
                      <MessageTextIcon size={16} />
                    </button>
                    <button className="action-btn icon-btn danger" onClick={() => removeFriend(f.id)} title="remove">
                      <UserXmarkIcon size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {friends.length === 0 && !loading && (
                <div className="empty-state">no friends yet. add someone!</div>
              )}
            </div>
          )}

          {tab === 'pending' && (
            <div className="list">
              {incoming.length > 0 && (
                <>
                  <div className="section-label overline">incoming</div>
                  {incoming.map((r: any) => (
                    <div key={r.id} className="item">
                      <div className="avatar">
                        {r.user.avatar_url ? <img src={r.user.avatar_url} alt="" /> : <span>{r.user.name[0]?.toUpperCase()}</span>}
                      </div>
                      <div className="info">
                        <span className="name">{r.user.name}</span>
                      </div>
                      <div className="actions">
                        <button className="action-btn icon-btn accept" onClick={() => acceptRequest(r.id)} title="accept">
                          <CheckIcon size={16} />
                        </button>
                        <button className="action-btn icon-btn danger" onClick={() => removeFriend(r.id)} title="decline">
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {outgoing.length > 0 && (
                <>
                  <div className="section-label overline">outgoing</div>
                  {outgoing.map((r: any) => (
                    <div key={r.id} className="item">
                      <div className="avatar">
                        {r.user.avatar_url ? <img src={r.user.avatar_url} alt="" /> : <span>{r.user.name[0]?.toUpperCase()}</span>}
                      </div>
                      <div className="info">
                        <span className="name">{r.user.name}</span>
                      </div>
                      <div className="actions">
                        <button className="action-btn icon-btn danger" onClick={() => removeFriend(r.id)} title="cancel">
                          <XIcon size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {pendingCount === 0 && (
                <div className="empty-state">no pending requests</div>
              )}
            </div>
          )}

          {tab === 'add' && (
            <div className="add-form">
              <div className="row">
                <div className="search-field">
                  <SearchIcon size={14} className="icon" />
                  <input
                    className="input"
                    placeholder="name"
                    value={addUsername}
                    onChange={(e) => { setAddUsername(e.target.value); setAddError(''); setAddSuccess(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    autoFocus
                  />
                </div>
                <button className="btn btn-primary" onClick={handleAdd} disabled={addLoading || !addUsername.trim()}>
                  {addLoading ? '...' : 'send'}
                </button>
              </div>
              {addError && <div className="error">{addError}</div>}
              {addSuccess && <div className="success">{addSuccess}</div>}
            </div>
          )}
        </div>

        {errorMsg && (
          <ConfirmDialog
            title="error"
            message={errorMsg}
            confirmLabel="ok"
            cancelLabel=""
            onConfirm={() => setErrorMsg(null)}
            onCancel={() => setErrorMsg(null)}
          />
        )}
      </div>
    </div>
  );
}
