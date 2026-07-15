import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCallStore } from '../stores/call';
import { useVoiceStore } from '../stores/voice';
import { useDmsStore } from '../stores/dms';
import { useAuthStore } from '../stores/auth';
import { api } from '../lib/api';
import { startRing, stopRing } from '../lib/sounds';
import { PhoneIcon } from './icons';
import './CallOverlay.css';

const RING_TIMEOUT = 30000;

export function OutgoingCallOverlay() {
  const outgoingCall = useCallStore((s) => s.outgoingCall);
  const setOutgoingCall = useCallStore((s) => s.setOutgoingCall);
  const activeCallDmChannelId = useCallStore((s) => s.activeCallDmChannelId);
  const channels = useDmsStore((s) => s.channels);
  const user = useAuthStore((s) => s.user);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!outgoingCall) { setUnavailable(false); return; }
    startRing();
    let innerTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      stopRing();
      setUnavailable(true);
      innerTimer = setTimeout(() => {
        api.endCall(outgoingCall.dmChannelId).catch(() => {});
        setOutgoingCall(null);
      }, 3000);
    }, RING_TIMEOUT);
    return () => { clearTimeout(timer); if (innerTimer) clearTimeout(innerTimer); stopRing(); };
  }, [outgoingCall, setOutgoingCall]);

  if (!outgoingCall || activeCallDmChannelId) return null;

  const channel = channels.find((c: any) => c.id === outgoingCall.dmChannelId);
  const others = channel?.members?.filter((m: any) => m.id !== user?.id) || [];
  const recipientName = others.map((m: any) => m.name).join(', ') || 'user';
  const recipientAvatar = others[0]?.avatar_url;

  const handleCancel = async () => {
    stopRing();
    try { await api.endCall(outgoingCall.dmChannelId); } catch {}
    setOutgoingCall(null);
  };

  return createPortal(
    <div className="call-overlay">
      <div className={`call-card ${unavailable ? 'ended' : ''}`}>
        <div className="call-who">
          <div className="call-avatar-wrap">
            {recipientAvatar ? (
              <img className="avatar call-avatar" src={recipientAvatar} alt="" />
            ) : (
              <div className="avatar call-avatar"><span>{recipientName[0]?.toUpperCase()}</span></div>
            )}
          </div>
          <div className="call-name">{recipientName}</div>
          <div className="call-status">
            {unavailable ? `${recipientName} is not available right now` : 'calling...'}
          </div>
        </div>
        {!unavailable && (
          <div className="call-actions">
            <button className="call-action-btn hangup" onClick={handleCancel} aria-label="cancel call">
              <PhoneIcon size={24} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
