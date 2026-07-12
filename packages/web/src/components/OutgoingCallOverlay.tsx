import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCallStore } from '../stores/call';
import { useVoiceStore } from '../stores/voice';
import { useDmsStore } from '../stores/dms';
import { useAuthStore } from '../stores/auth';
import { api } from '../lib/api';
import { startRing, stopRing } from '../lib/sounds';
import { PhoneIcon } from './icons';
import './OutgoingCallOverlay.css';

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
    <div className="outgoing-call-overlay">
      <div className="outgoing-call">
        <div className="caller-info">
          {recipientAvatar ? (
            <img className="caller-avatar" src={recipientAvatar} alt="" />
          ) : (
            <div className="caller-avatar placeholder">
              <span>{recipientName[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="caller-name">{recipientName}</div>
          <div className="caller-label">
            {unavailable ? `${recipientName} is not available right now` : 'calling...'}
          </div>
        </div>
        {!unavailable && (
          <div className="call-actions">
            <button className="call-btn reject" onClick={handleCancel}>
              <PhoneIcon size={20} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
