let ctx: AudioContext | null = null;
let warmedUp = false;
const buffers: Record<string, AudioBuffer> = {};

const FILES: Record<string, string> = {
  message: '/sounds/message.wav',
  dm: '/sounds/dm.wav',
  join: '/sounds/join.wav',
  ring: '/sounds/ring.wav',
};

async function loadBuffer(c: AudioContext, name: string, url: string) {
  try {
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    buffers[name] = await c.decodeAudioData(arr);
  } catch {
    return;
  }
}

function warmup() {
  if (warmedUp) return;
  warmedUp = true;
  try {
    ctx = new AudioContext();
    for (const [name, url] of Object.entries(FILES)) loadBuffer(ctx, name, url);
  } catch {
    return;
  }
}

if (typeof document !== 'undefined') {
  const events = ['pointerdown', 'keydown', 'touchstart'];
  const handler = () => {
    warmup();
    events.forEach((e) => document.removeEventListener(e, handler));
  };
  events.forEach((e) => document.addEventListener(e, handler));
}

function getCtx(): AudioContext | null {
  if (!ctx || ctx.state === 'closed') return null;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function playBuffer(name: string, gain: number, loop = false): AudioBufferSourceNode | null {
  const c = getCtx();
  if (!c) return null;
  const buf = buffers[name];
  if (!buf) return null;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = loop;
  const g = c.createGain();
  g.gain.value = gain;
  src.connect(g);
  g.connect(c.destination);
  src.start();
  return src;
}

export function playMessageChime() {
  playBuffer('message', 0.5);
}

export function playDmChime() {
  playBuffer('dm', 0.55);
}

export function playJoinChime() {
  playBuffer('join', 0.45);
}

let ringSrc: AudioBufferSourceNode | null = null;

export function startRing() {
  stopRing();
  ringSrc = playBuffer('ring', 0.7, true);
}

export function stopRing() {
  if (ringSrc) {
    try {
      ringSrc.stop();
    } catch {
      return;
    } finally {
      ringSrc = null;
    }
  }
}
