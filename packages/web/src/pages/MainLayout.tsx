import { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router';
import { useClubsStore } from '../stores/clubs';
import { useChannelsStore } from '../stores/channels';
import { useFriendsStore } from '../stores/friends';
import { useDmsStore } from '../stores/dms';
import { useModalStore } from '../stores/modal';
import { useUnreadStore, getTotalUnreadCount } from '../stores/unread';
import { api } from '../lib/api';
import { wsClient } from '../lib/ws';
import { useWsHandler } from '../hooks/useWsHandler';
import { Navbar } from '../components/Navbar';
import { ClubSidebar } from '../components/ClubSidebar';
import { ChannelSidebar } from '../components/ChannelSidebar';
import { ChannelView } from '../components/ChannelView';
import { VoiceChannelView } from '../components/VoiceChannelView';
import { MemberSidebar } from '../components/MemberSidebar';
import { SettingsModal } from '../components/SettingsModal';
import { DMSidebar } from '../components/DMSidebar';
import { DMView } from '../components/DMView';
import { ProfileModal } from '../components/ProfileModal';
import { FriendsModal } from '../components/FriendsModal';
import { CreateProfileModal } from '../components/CreateProfileModal';
import { ClubMembersModal } from '../components/ClubMembersModal';
import { EditClubModal } from '../components/EditClubModal';
import { CreateChannelModal } from '../components/CreateChannelModal';
import { CreateSectionModal } from '../components/CreateSectionModal';
import { IncomingCallOverlay } from '../components/IncomingCallOverlay';
import { OutgoingCallOverlay } from '../components/OutgoingCallOverlay';
import './MainLayout.css';

const EMPTY_CHANNELS: any[] = [];

export function MainLayout() {
  const { fetchClubs } = useClubsStore();
  const { fetchFriends, fetchPending } = useFriendsStore();
  const { fetchDmChannels } = useDmsStore();
  const active = useModalStore((s) => s.active);
  const profileUserId = useModalStore((s) => s.profileUserId);
  const openProfile = useModalStore((s) => s.openProfile);
  const openSettings = useModalStore((s) => s.openSettings);
  const openFriends = useModalStore((s) => s.openFriends);
  const openCreateProfile = useModalStore((s) => s.openCreateProfile);
  const close = useModalStore((s) => s.close);

  useEffect(() => {
    fetchClubs().then(() => {
      const clubs = useClubsStore.getState().clubs;
      clubs.forEach(c => useChannelsStore.getState().fetchChannels(c.id));
    });
    fetchFriends();
    fetchPending();
    fetchDmChannels();
    wsClient.connect();
    return () => wsClient.disconnect();
  }, [fetchClubs, fetchFriends, fetchPending, fetchDmChannels]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('profile_setup') === '1';
    const fromStorage = !!localStorage.getItem('needs_profile_setup');
    if (fromUrl || fromStorage) {
      if (fromUrl) {
        localStorage.setItem('needs_profile_setup', 'true');
        window.history.replaceState({}, '', window.location.pathname);
      }
      openCreateProfile();
    }
  }, [openCreateProfile]);

  useWsHandler();

  const channelLastMessage = useUnreadStore((s) => s.channelLastMessage);
  const channelLastRead = useUnreadStore((s) => s.channelLastRead);
  const dmLastMessage = useUnreadStore((s) => s.dmLastMessage);
  const dmLastRead = useUnreadStore((s) => s.dmLastRead);

  useEffect(() => {
    const count = getTotalUnreadCount();
    document.title = count > 0 ? `(${count}) wazup` : 'wazup';
  }, [channelLastMessage, channelLastRead, dmLastMessage, dmLastRead]);

  return (
    <div className="main-layout">
      <Navbar
        onFriendsClick={openFriends}
        onProfileClick={() => openProfile()}
        onSettingsClick={openSettings}
      />
      <div className="content">
        <ClubSidebar />
        <Routes>
          <Route path="club/:clubId/*" element={
            <ClubContent />
          } />
          <Route path="dm/:dmChannelId" element={
            <DmContent />
          } />
          <Route path="dm" element={
            <DmContent />
          } />
          <Route path="*" element={
            <DmContent />
          } />
        </Routes>
      </div>
      {active === 'settings' && <SettingsModal onClose={close} />}
      {active === 'profile' && <ProfileModal userId={profileUserId} onClose={close} />}
      {active === 'friends' && <FriendsModal onClose={close} />}
      {active === 'create-profile' && <CreateProfileModal onClose={() => {
        localStorage.removeItem('needs_profile_setup');
        close();
      }} />}
      {active === 'club-members' && <ClubMembersModal />}
      {active === 'edit-club' && <EditClubModal />}
      {active === 'create-channel' && <CreateChannelModal />}
      {active === 'create-section' && <CreateSectionModal />}
      <IncomingCallOverlay />
      <OutgoingCallOverlay />
    </div>
  );
}

function DmContent() {
  const { dmChannelId } = useParams<{ dmChannelId: string }>();
  const setCurrentDm = useDmsStore((s) => s.setCurrentDm);

  useEffect(() => {
    if (dmChannelId) setCurrentDm(dmChannelId);
    return () => setCurrentDm(null);
  }, [dmChannelId, setCurrentDm]);

  return (
    <>
      <DMSidebar />
      {dmChannelId ? (
        <DMView />
      ) : (
        <div className="empty">
          <h2>your messages</h2>
          <p>select a conversation or start a new one</p>
        </div>
      )}
    </>
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ClubContent() {
  const { clubId: param } = useParams<{ clubId: string }>();
  const { setCurrentClub } = useClubsStore();
  const clubs = useClubsStore((s) => s.clubs);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  const fromStore = clubs.find((c) => c.id === param || c.slug === param);
  const clubId = fromStore?.id || resolvedId;

  useEffect(() => {
    if (!param) return;
    if (UUID_RE.test(param)) {
      setResolvedId(param);
      return;
    }
    const found = useClubsStore.getState().clubs.find((c) => c.id === param || c.slug === param);
    if (found) {
      setResolvedId(found.id);
      return;
    }
    api.getClub(param).then((c) => setResolvedId(c.id)).catch(() => {});
  }, [param]);

  useEffect(() => {
    if (clubId) setCurrentClub(clubId);
    return () => setCurrentClub(null);
  }, [clubId, setCurrentClub]);

  if (!clubId) return null;

  return (
    <>
      <ChannelSidebar clubId={clubId} />
      <Routes>
        <Route path="channel/:channelId" element={
          <ChannelRoute clubId={clubId} />
        } />
        <Route path="*" element={
          <div className="empty">
            <p>select a channel</p>
          </div>
        } />
      </Routes>
    </>
  );
}

function ChannelRoute({ clubId }: { clubId: string }) {
  const { channelId } = useParams<{ channelId: string }>();
  const channels = useChannelsStore((s) => s.channels[clubId] ?? EMPTY_CHANNELS);
  const setCurrentChannel = useChannelsStore((s) => s.setCurrentChannel);
  const channel = channels.find((c: any) => c.id === channelId);

  useEffect(() => {
    if (channelId) setCurrentChannel(channelId);
    return () => setCurrentChannel(null);
  }, [channelId, setCurrentChannel]);

  if (!channel || !channelId) return null;

  if (channel.type === 'voice') {
    return (
      <>
        <VoiceChannelView clubId={clubId} channelId={channelId} />
        <MemberSidebar clubId={clubId} />
      </>
    );
  }

  return (
    <>
      <ChannelView clubId={clubId} />
      <MemberSidebar clubId={clubId} />
    </>
  );
}
