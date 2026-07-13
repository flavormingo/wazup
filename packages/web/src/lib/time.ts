import { getTimeFormat } from './preferences';

function timeStr(d: Date): string {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: getTimeFormat() === '12h' });
}

function isToday(d: Date): boolean {
  return d.toDateString() === new Date().toDateString();
}

export function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) {
    return `today at ${timeStr(d)}`;
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + timeStr(d);
}

export function formatShortTime(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) {
    return timeStr(d);
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
