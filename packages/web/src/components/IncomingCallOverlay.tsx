import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useCallStore } from '../stores/call';
import { useVoiceStore } from '../stores/voice';
import { api } from '../lib/api';
import { stopRing } from '../lib/sounds';
import { PhoneIcon } from './icons';
import './CallOverlay.css';

export function IncomingCallOverlay() {
  const incomingCall = useCallStore((s) => s.incomingCall);
  const setIncomingCall = useCallStore((s) => s.setIncomingCall);
  const setActiveCall = useCallStore((s) => s.setActiveCall);
  const joinDmCall = useVoiceStore((s) => s.joinDmCall);
  const connected = useVoiceStore((s) => s.connected);
  const navigate = useNavigate();

  useEffect(() => {
    if (!incomingCall) return;
    const timer = setTimeout(() => {
      stopRing();
      setIncomingCall(null);
    }, 30000);
    return () => { clearTimeout(timer); stopRing(); };
  }, [incomingCall, setIncomingCall]);

  if (!incomingCall) return null;

  const handleAccept = async () => {
    stopRing();
    try {
      const dmId = incomingCall.dmChannelId;
      const { token, url } = await api.acceptCall(dmId);
      setActiveCall(dmId);
      setIncomingCall(null);
      navigate(`/dm/${dmId}`);
      await joinDmCall(dmId, token, url);
    } catch (err) {
      console.error('Failed to accept call:', err);
      setIncomingCall(null);
    }
  };

  const handleReject = async () => {
    stopRing();
    try {
      await api.rejectCall(incomingCall.dmChannelId);
    } catch {}
    setIncomingCall(null);
  };

  const caller = incomingCall.caller.display_name || incomingCall.caller.username;

  return createPortal(
    <div className="call-overlay">
      <div className="call-card">
        <div className="call-who">
          <div className="call-avatar-wrap">
            {incomingCall.caller.avatar_url ? (
              <img className="avatar call-avatar" src={incomingCall.caller.avatar_url} alt="" />
            ) : (
              <div className="avatar call-avatar"><span>{caller[0]?.toUpperCase()}</span></div>
            )}
          </div>
          <div className="call-name">{caller}</div>
          <div className="call-status">incoming call</div>
        </div>
        <div className="call-actions">
          <button className="call-action-btn accept" onClick={handleAccept} disabled={connected} aria-label="accept call">
            <PhoneIcon size={24} />
          </button>
          <button className="call-action-btn hangup" onClick={handleReject} aria-label="decline call">
            <PhoneIcon size={24} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
