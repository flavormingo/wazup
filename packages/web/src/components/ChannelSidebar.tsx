import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useChannelsStore } from '../stores/channels';
import { useClubsStore } from '../stores/clubs';
import { useAuthStore } from '../stores/auth';
import { useModalStore } from '../stores/modal';
import { useSectionsStore } from '../stores/sections';
import { useUnreadStore, isChannelUnread } from '../stores/unread';
import { api } from '../lib/api';
import { HashIcon, VolumeIcon, PlusIcon, ChevronDownIcon, UserPlusIcon, SignOutIcon, UsersIcon, EditIcon, TrashIcon, FolderIcon } from './icons';
import { ConfirmDialog } from './ConfirmDialog';
import { InviteModal } from './InviteModal';
import { VoicePanel } from './VoicePanel';
import './ChannelSidebar.css';

const ADMIN_BIT = 1n << 10n;
const EMPTY: any[] = [];

interface Props {
  clubId: string;
}

export function ChannelSidebar({ clubId }: Props) {
  const { channels, fetchChannels, setCurrentChannel, currentChannelId, updateChannel: storeUpdateChannel, removeChannel, clearSectionId } = useChannelsStore();
  const clubs = useClubsStore((s) => s.clubs);
  const user = useAuthStore((s) => s.user);
  const openClubMembers = useModalStore((s) => s.openClubMembers);
  const openEditClub = useModalStore((s) => s.openEditClub);
  const openCreateChannel = useModalStore((s) => s.openCreateChannel);
  const openCreateSection = useModalStore((s) => s.openCreateSection);
  const { sections, fetchSections, updateSection: storeUpdateSection, removeSection: storeRemoveSection } = useSectionsStore();
  const navigate = useNavigate();
  const channelId = currentChannelId;
  const [showClubMenu, setShowClubMenu] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteNotice, setInviteNotice] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [myRoles, setMyRoles] = useState<any[]>([]);
  const [editingChannel, setEditingChannel] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [deletingChannel, setDeletingChannel] = useState<any | null>(null);
  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [editSectionName, setEditSectionName] = useState('');
  const [editSectionError, setEditSectionError] = useState('');
  const [deletingSection, setDeletingSection] = useState<any | null>(null);

  useUnreadStore((s) => s.channelLastRead);
  useUnreadStore((s) => s.channelLastMessage);

  const club = clubs.find((c) => c.id === clubId);
  const clubChannels = channels[clubId] ?? EMPTY;
  const clubSections = sections[clubId] ?? EMPTY;

  const isOwner = club?.owner_id === user?.id;
  const isAdmin = isOwner || myRoles.some((r: any) => {
    try { return (BigInt(r.permissions) & ADMIN_BIT) !== 0n; } catch { return false; }
  });

  useEffect(() => {
    fetchChannels(clubId);
    fetchSections(clubId);
  }, [clubId, fetchChannels, fetchSections]);

  useEffect(() => {
    if (!clubId || !user?.id) return;
    api.getMembers(clubId).then((members) => {
      const me = members.find((m: any) => m.user.id === user.id);
      if (me) setMyRoles(me.roles || []);
    }).catch(() => {});
  }, [clubId, user?.id]);

  const handleSelectChannel = (id: string) => {
    setCurrentChannel(id);
    navigate(`/club/${club?.slug || clubId}/channel/${id}`);
  };

  const handleLeaveClub = async () => {
    try {
      await api.kickMember(clubId, user.id);
      useClubsStore.getState().removeClub(clubId);
      navigate('/');
    } catch (e: any) {
      setInviteNotice(e.message);
    }
  };

  const handleDeleteClub = async () => {
    try {
      await api.deleteClub(clubId);
      useClubsStore.getState().removeClub(clubId);
      navigate('/');
    } catch (e: any) {
      setInviteNotice(e.message);
    }
  };

  const handleEditChannel = (ch: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChannel(ch);
    setEditName(ch.name);
    setEditError('');
  };

  const handleSaveEdit = async () => {
    const name = editName.trim();
    if (!name) return;
    if (name === editingChannel.name) { setEditingChannel(null); return; }
    try {
      const updated = await api.updateChannel(clubId, editingChannel.id, { name });
      storeUpdateChannel(updated);
      setEditingChannel(null);
    } catch (e: any) {
      setEditError(e.message);
    }
  };

  const handleDeleteChannel = async () => {
    if (!deletingChannel) return;
    try {
      await api.deleteChannel(clubId, deletingChannel.id);
      removeChannel(deletingChannel.id, clubId);
      if (channelId === deletingChannel.id) {
        const remaining = clubChannels.filter((c) => c.id !== deletingChannel.id);
        if (remaining.length > 0) {
          handleSelectChannel(remaining[0].id);
        } else {
          navigate(`/club/${club?.slug || clubId}`);
        }
      }
      setDeletingChannel(null);
    } catch (e: any) {
      setInviteNotice(e.message);
      setDeletingChannel(null);
    }
  };

  const handleEditSection = (sec: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSection(sec);
    setEditSectionName(sec.name);
    setEditSectionError('');
  };

  const handleSaveSectionEdit = async () => {
    const name = editSectionName.trim();
    if (!name) return;
    if (name === editingSection.name) { setEditingSection(null); return; }
    try {
      const updated = await api.updateSection(clubId, editingSection.id, { name });
      storeUpdateSection(updated);
      setEditingSection(null);
    } catch (e: any) {
      setEditSectionError(e.message);
    }
  };

  const handleDeleteSection = async () => {
    if (!deletingSection) return;
    try {
      await api.deleteSection(clubId, deletingSection.id);
      clearSectionId(deletingSection.id, clubId);
      storeRemoveSection(deletingSection.id, clubId);
      setDeletingSection(null);
    } catch (e: any) {
      setInviteNotice(e.message);
      setDeletingSection(null);
    }
  };

  const renderChannel = (ch: any) => {
    const unread = isChannelUnread(ch.id);
    return (
    <button
      key={ch.id}
      className={`item ${ch.id === channelId ? 'active' : ''} ${unread ? 'unread' : ''}`}
      onClick={() => handleSelectChannel(ch.id)}
    >
      {ch.type === 'voice' ? <VolumeIcon size={18} className="icon" /> : <HashIcon size={18} className="icon" />}
      <span className="name">{ch.name}</span>
      {isAdmin && (
        <span className="channel-actions">
          <span className="channel-action" onClick={(e) => handleEditChannel(ch, e)} role="button">
            <EditIcon size={13} />
          </span>
          <span className="channel-action danger" onClick={(e) => { e.stopPropagation(); setDeletingChannel(ch); }} role="button">
            <TrashIcon size={13} />
          </span>
        </span>
      )}
    </button>
  );
  };

  const sortedSections = [...clubSections].sort((a, b) => a.position - b.position);
  const uncategorized = clubChannels.filter((c) => !c.section_id);

  return (
    <div className="channel-sidebar">
      <div className="header" onClick={() => setShowClubMenu(!showClubMenu)}>
        <span className="name">{club?.name || 'loading...'}</span>
        <ChevronDownIcon size={14} />
      </div>

      {showClubMenu && (
        <>
          <div className="dropdown-backdrop" onClick={() => setShowClubMenu(false)} />
          <div className="dropdown">
            <button className="dropdown-item" onClick={() => { setShowInviteModal(true); setShowClubMenu(false); }}>
              <UserPlusIcon size={16} /> invite people
            </button>
            <button className="dropdown-item" onClick={() => { openClubMembers(clubId); setShowClubMenu(false); }}>
              <UsersIcon size={16} /> club members
            </button>
            {isAdmin && (
              <button className="dropdown-item" onClick={() => { openEditClub(clubId); setShowClubMenu(false); }}>
                <EditIcon size={16} /> edit club
              </button>
            )}
            {isAdmin && (
              <button className="dropdown-item" onClick={() => { openCreateChannel(clubId); setShowClubMenu(false); }}>
                <PlusIcon size={16} /> create channel
              </button>
            )}
            {isAdmin && (
              <button className="dropdown-item" onClick={() => { openCreateSection(clubId); setShowClubMenu(false); }}>
                <FolderIcon size={16} /> create section
              </button>
            )}
            <div style={{ height: 1, background: 'var(--border)', margin: 'var(--space-xs) 0' }} />
            {!isOwner && (
              <button className="dropdown-item text-danger" onClick={() => { setShowLeaveConfirm(true); setShowClubMenu(false); }}>
                <SignOutIcon size={16} /> leave club
              </button>
            )}
            {isOwner && (
              <button className="dropdown-item text-danger" onClick={() => { setShowDeleteConfirm(true); setShowClubMenu(false); }}>
                <TrashIcon size={16} /> delete club
              </button>
            )}
          </div>
        </>
      )}

      <div className="list">
        {sortedSections.map((sec) => {
          const sectionChannels = clubChannels.filter((c) => c.section_id === sec.id);
          return (
            <div key={sec.id}>
              <div className="category">
                <span className="label">{sec.name}</span>
                <span className="category-actions">
                  {isAdmin && (
                    <>
                      <button className="add" onClick={() => openCreateChannel(clubId, undefined, sec.id)}>
                        <PlusIcon size={14} />
                      </button>
                      <button className="add" onClick={(e) => handleEditSection(sec, e)}>
                        <EditIcon size={12} />
                      </button>
                      <button className="add danger-hover" onClick={() => setDeletingSection(sec)}>
                        <TrashIcon size={12} />
                      </button>
                    </>
                  )}
                </span>
              </div>
              {sectionChannels.map(renderChannel)}
            </div>
          );
        })}

        {uncategorized.length > 0 && (
          <>
            <div className="category">
              <span className="label">uncategorized</span>
              {isAdmin && (
                <button className="add" onClick={() => openCreateChannel(clubId)}>
                  <PlusIcon size={14} />
                </button>
              )}
            </div>
            {uncategorized.map(renderChannel)}
          </>
        )}
      </div>

      <VoicePanel />

      {showLeaveConfirm && (
        <ConfirmDialog
          title="leave club"
          message={`are you sure you want to leave ${club?.name || 'this club'}?`}
          confirmLabel="leave"
          danger
          onConfirm={() => { setShowLeaveConfirm(false); handleLeaveClub(); }}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="delete club"
          message={`are you sure you want to delete ${club?.name || 'this club'}? this cannot be undone.`}
          confirmLabel="delete"
          danger
          onConfirm={() => { setShowDeleteConfirm(false); handleDeleteClub(); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {deletingChannel && (
        <ConfirmDialog
          title="delete channel"
          message={`are you sure you want to delete #${deletingChannel.name}? this cannot be undone.`}
          confirmLabel="delete"
          danger
          onConfirm={handleDeleteChannel}
          onCancel={() => setDeletingChannel(null)}
        />
      )}

      {deletingSection && (
        <ConfirmDialog
          title="delete section"
          message={`are you sure you want to delete "${deletingSection.name}"? channels will become uncategorized.`}
          confirmLabel="delete"
          danger
          onConfirm={handleDeleteSection}
          onCancel={() => setDeletingSection(null)}
        />
      )}

      {editingChannel && createPortal(
        <div className="modal-overlay" onClick={() => setEditingChannel(null)}>
          <div className="modal edit-channel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="title">edit channel</div>
            {editError && <div className="modal-error">{editError}</div>}
            <input
              className="input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              autoFocus
              maxLength={100}
            />
            <div className="actions">
              <button className="btn btn-secondary" onClick={() => setEditingChannel(null)}>cancel</button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>save</button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {editingSection && createPortal(
        <div className="modal-overlay" onClick={() => setEditingSection(null)}>
          <div className="modal edit-channel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="title">edit section</div>
            {editSectionError && <div className="modal-error">{editSectionError}</div>}
            <input
              className="input"
              value={editSectionName}
              onChange={(e) => setEditSectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSectionEdit()}
              autoFocus
              maxLength={100}
            />
            <div className="actions">
              <button className="btn btn-secondary" onClick={() => setEditingSection(null)}>cancel</button>
              <button className="btn btn-primary" onClick={handleSaveSectionEdit}>save</button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {showInviteModal && (
        <InviteModal clubId={clubId} onClose={() => setShowInviteModal(false)} />
      )}

      {inviteNotice && (
        <ConfirmDialog
          title="error"
          message={inviteNotice}
          confirmLabel="ok"
          cancelLabel=""
          onConfirm={() => setInviteNotice(null)}
          onCancel={() => setInviteNotice(null)}
        />
      )}
    </div>
  );
}
