import { useEffect } from 'react';
import { useMembersStore } from '../stores/members';
import { usePresenceStore } from '../stores/presence';
import { useClubsStore } from '../stores/clubs';
import { useModalStore } from '../stores/modal';
import { api } from '../lib/api';
import { CrownIcon, FlareIcon } from './icons';
import './MemberSidebar.css';

const ADMIN_BIT = 1n << 10n;

interface Props {
  clubId: string;
}

export function MemberSidebar({ clubId }: Props) {
  const { members, fetchMembers } = useMembersStore();
  const statuses = usePresenceStore((s) => s.statuses);
  const setBulk = usePresenceStore((s) => s.setBulk);
  const openProfile = useModalStore((s) => s.openProfile);
  const clubs = useClubsStore((s) => s.clubs);
  const club = clubs.find((c) => c.id === clubId);
  const ownerId = club?.owner_id;
  const clubMembers = members[clubId] || [];

  useEffect(() => {
    fetchMembers(clubId);
    api.getPresence(clubId).then(setBulk).catch(() => {});
  }, [clubId, fetchMembers, setBulk]);

  const onlineMembers = clubMembers.filter((m: any) => {
    const status = statuses[m.user.id];
    return status && status !== 'offline';
  });

  const offlineMembers = clubMembers.filter((m: any) => {
    const status = statuses[m.user.id];
    return !status || status === 'offline';
  });

  return (
    <div className="member-sidebar">
      {onlineMembers.length > 0 && (
        <>
          <div className="category overline">online ({onlineMembers.length})</div>
          {onlineMembers.map((m: any) => (
            <MemberItem key={m.id} member={m} ownerId={ownerId} status={statuses[m.user.id] || 'online'} onClick={() => openProfile(m.user.id)} />
          ))}
        </>
      )}
      {offlineMembers.length > 0 && (
        <>
          <div className="category overline">offline ({offlineMembers.length})</div>
          {offlineMembers.map((m: any) => (
            <MemberItem key={m.id} member={m} ownerId={ownerId} status="offline" onClick={() => openProfile(m.user.id)} />
          ))}
        </>
      )}
      {clubMembers.length === 0 && (
        <div className="category overline">no members loaded</div>
      )}
    </div>
  );
}

function MemberItem({ member, ownerId, status, onClick }: { member: any; ownerId?: string; status: string; onClick: () => void }) {
  const displayName = member.nickname || member.user.name;
  const topRole = member.roles?.[0];
  const isMemberOwner = member.user.id === ownerId;
  const isMemberAdmin = !isMemberOwner && member.roles?.some((r: any) => {
    try { return (BigInt(r.permissions) & ADMIN_BIT) !== 0n; } catch { return false; }
  });

  return (
    <div
      className={`item ${status === 'offline' ? 'offline' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
    >
      <div className="avatar">
        {member.user.avatar_url ? (
          <img src={member.user.avatar_url} alt="" />
        ) : (
          <span>{member.user.name[0]?.toUpperCase()}</span>
        )}
        <div className={`dot dot-badge ${status}`} />
      </div>
      <div className="info">
        <span
          className="name"
          style={topRole?.color ? { color: topRole.color } : undefined}
        >
          {displayName}
          {isMemberOwner && <CrownIcon size={13} className="role-badge role-badge-owner" />}
          {isMemberAdmin && <FlareIcon size={13} className="role-badge role-badge-admin" />}
        </span>
      </div>
    </div>
  );
}
