import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useCallStore } from '../stores/call';
import { useVoiceStore } from '../stores/voice';
import { api } from '../lib/api';
import { stopRing } from '../lib/sounds';
import { PhoneIcon, XIcon } from './icons';
import './IncomingCallOverlay.css';

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

  return createPortal(
    <div className="incoming-call-overlay">
      <div className="incoming-call">
        <div className="caller-info">
          {incomingCall.caller.avatar_url ? (
            <img className="avatar caller-avatar" src={incomingCall.caller.avatar_url} alt="" />
          ) : (
            <div className="avatar caller-avatar placeholder">
              <span>{incomingCall.caller.username[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="caller-name">{incomingCall.caller.display_name || incomingCall.caller.username}</div>
          <div className="caller-label">incoming call...</div>
        </div>
        <div className="call-actions">
          <button className="call-btn accept" onClick={handleAccept} disabled={connected} aria-label="accept call">
            <PhoneIcon size={20} />
          </button>
          <button className="call-btn reject" onClick={handleReject} aria-label="decline call">
            <XIcon size={20} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
