import { useVoiceStore } from '../stores/voice';
import { useChannelsStore } from '../stores/channels';
import { useClubsStore } from '../stores/clubs';
import { useCallStore } from '../stores/call';
import { api } from '../lib/api';
import { MicIcon, MicMutedIcon, HeadphonesIcon, PhoneIcon } from './icons';
import './VoicePanel.css';

const EMPTY_CHANNELS: any[] = [];

export function VoicePanel() {
  const channelId = useVoiceStore((s) => s.channelId);
  const callType = useVoiceStore((s) => s.callType);
  const dmChannelId = useVoiceStore((s) => s.dmChannelId);
  const connected = useVoiceStore((s) => s.connected);
  const muted = useVoiceStore((s) => s.muted);
  const deafened = useVoiceStore((s) => s.deafened);
  const toggleMute = useVoiceStore((s) => s.toggleMute);
  const toggleDeafen = useVoiceStore((s) => s.toggleDeafen);
  const leaveVoice = useVoiceStore((s) => s.leaveVoice);
  const clearCallAll = useCallStore((s) => s.clearAll);
  const currentClubId = useClubsStore((s) => s.currentClubId);
  const channels = useChannelsStore((s) => currentClubId ? s.channels[currentClubId] ?? EMPTY_CHANNELS : EMPTY_CHANNELS);

  const channel = channels.find((c: any) => c.id === channelId);

  if (!connected) return null;

  const handleDisconnect = async () => {
    if (callType === 'dm' && dmChannelId) {
      try { await api.endCall(dmChannelId); } catch {}
      clearCallAll();
    }
    leaveVoice();
  };

  const label = callType === 'dm' ? 'dm call' : (channel?.name || 'voice');

  return (
    <div className="voice-panel">
      <div className="info">
        <div className="status">
          <span className="dot" />
          connected
        </div>
        <div className="channel">{label}</div>
      </div>
      <div className="controls">
        <button
          className={`icon-btn ${muted ? 'active' : ''}`}
          onClick={toggleMute}
          aria-label={muted ? 'unmute' : 'mute'}
        >
          {muted ? <MicMutedIcon size={16} /> : <MicIcon size={16} />}
        </button>
        <button
          className={`icon-btn ${deafened ? 'active' : ''}`}
          onClick={toggleDeafen}
          aria-label={deafened ? 'undeafen' : 'deafen'}
        >
          <HeadphonesIcon size={16} />
        </button>
        <button
          className="icon-btn disconnect"
          onClick={handleDisconnect}
          aria-label="disconnect"
        >
          <PhoneIcon size={16} />
        </button>
      </div>
    </div>
  );
}
