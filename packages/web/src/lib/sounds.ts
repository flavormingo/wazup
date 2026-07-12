let ctx: AudioContext | null = null;
let warmedUp = false;

function warmup() {
  if (warmedUp) return;
  warmedUp = true;
  ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.01);
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }
}

if (typeof document !== 'undefined') {
  const events = ['click', 'keydown', 'touchstart'];
  const handler = () => {
    warmup();
    events.forEach(e => document.removeEventListener(e, handler));
  };
  events.forEach(e => document.addEventListener(e, handler));
}

function getCtx(): AudioContext | null {
  if (!ctx || ctx.state === 'closed') return null;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function playMessageChime() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  gain.connect(c.destination);

  const o1 = c.createOscillator();
  o1.type = 'sine';
  o1.frequency.value = 587;
  o1.connect(gain);
  o1.start(now);
  o1.stop(now + 0.15);

  const o2 = c.createOscillator();
  o2.type = 'sine';
  o2.frequency.value = 784;
  o2.connect(gain);
  o2.start(now + 0.1);
  o2.stop(now + 0.3);
}

let ringGain: GainNode | null = null;
let ringInterval: ReturnType<typeof setInterval> | null = null;

export function startRing() {
  stopRing();
  const c = getCtx();
  if (!c) return;

  ringGain = c.createGain();
  ringGain.gain.value = 0.1;
  ringGain.connect(c.destination);

  let toggle = false;
  const playTone = () => {
    if (!c || !ringGain) return;
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = toggle ? 520 : 440;
    osc.connect(ringGain);
    osc.start();
    osc.stop(c.currentTime + 0.4);
    toggle = !toggle;
  };

  playTone();
  ringInterval = setInterval(playTone, 600);
}

export function stopRing() {
  if (ringInterval) { clearInterval(ringInterval); ringInterval = null; }
  if (ringGain) { ringGain.disconnect(); ringGain = null; }
}

export function playJoinChime() {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  gain.connect(c.destination);

  const osc = c.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.linearRampToValueAtTime(660, now + 0.15);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.2);
}
