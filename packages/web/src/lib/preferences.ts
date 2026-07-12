export type TimeFormat = '12h' | '24h';
export type FriendPrivacy = 'everyone' | 'friends-of-friends' | 'club-members';

export function getTimeFormat(): TimeFormat {
  return (localStorage.getItem('timeFormat') as TimeFormat) || '12h';
}

export function setTimeFormat(format: TimeFormat) {
  localStorage.setItem('timeFormat', format);
}

export function getFriendPrivacy(): FriendPrivacy {
  return (localStorage.getItem('friendPrivacy') as FriendPrivacy) || 'everyone';
}

export function setFriendPrivacy(value: FriendPrivacy) {
  localStorage.setItem('friendPrivacy', value);
}

export function getHighContrast(): boolean {
  return localStorage.getItem('highContrast') === 'true';
}

export function setHighContrast(on: boolean) {
  localStorage.setItem('highContrast', String(on));
  if (on) {
    document.documentElement.setAttribute('data-high-contrast', 'true');
  } else {
    document.documentElement.removeAttribute('data-high-contrast');
  }
}

export function initPreferences() {
  if (getHighContrast()) {
    document.documentElement.setAttribute('data-high-contrast', 'true');
  }
}
