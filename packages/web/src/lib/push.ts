import { api } from './api';

export function isPushSupported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIOS() {
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document)
  );
}

export function needsInstall() {
  return isIOS() && !isStandalone();
}

export function permissionState(): NotificationPermission {
  return isPushSupported() ? Notification.permission : 'denied';
}

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) arr[i] = raw.charCodeAt(i);
  return arr;
}

async function subscribeAndSync(reg: ServiceWorkerRegistration) {
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { publicKey } = await api.getVapidKey();
    if (!publicKey) return null;
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }
  const json = sub.toJSON();
  if (!json.keys?.p256dh || !json.keys?.auth) return null;
  await api.pushSubscribe({
    endpoint: sub.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    ua: navigator.userAgent,
  });
  return sub;
}

export type EnableResult = 'enabled' | 'denied' | 'unsupported' | 'needs-install';

export async function enablePush(): Promise<EnableResult> {
  if (!isPushSupported()) return 'unsupported';
  if (needsInstall()) return 'needs-install';
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return 'denied';
  const reg = await navigator.serviceWorker.ready;
  const sub = await subscribeAndSync(reg);
  return sub ? 'enabled' : 'denied';
}

export async function reconcilePush() {
  if (!isPushSupported() || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await subscribeAndSync(reg);
  } catch {
    return;
  }
}

export async function disablePush() {
  if (!isPushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await api.pushUnsubscribe(sub.endpoint).catch(() => {});
      await sub.unsubscribe().catch(() => {});
    }
  } catch {
    return;
  }
}

let autoTried = false;

export function maybeAutoEnable() {
  if (autoTried) return;
  if (!isPushSupported() || needsInstall()) return;
  const perm = permissionState();
  if (perm === 'granted') {
    autoTried = true;
    reconcilePush();
    return;
  }
  if (perm !== 'default') return;
  autoTried = true;
  let fired = false;
  const handler = () => {
    if (fired) return;
    fired = true;
    document.removeEventListener('pointerdown', handler);
    document.removeEventListener('keydown', handler);
    enablePush().catch(() => {});
  };
  document.addEventListener('pointerdown', handler);
  document.addEventListener('keydown', handler);
}

export async function isPushEnabled() {
  if (!isPushSupported() || Notification.permission !== 'granted') return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch {
    return false;
  }
}
