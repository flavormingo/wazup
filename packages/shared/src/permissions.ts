export const Permissions = {
  SEND_MESSAGES:    1n << 0n,
  MANAGE_MESSAGES:  1n << 1n,
  MANAGE_CHANNELS:  1n << 2n,
  MANAGE_ROLES:     1n << 3n,
  MANAGE_CLUB:      1n << 4n,
  KICK_MEMBERS:     1n << 5n,
  BAN_MEMBERS:      1n << 6n,
  CONNECT_VOICE:    1n << 7n,
  SPEAK:            1n << 8n,
  STREAM:           1n << 9n,
  ADMIN:            1n << 10n,
  CREATE_INVITE:    1n << 11n,
  ATTACH_FILES:     1n << 12n,
  VIEW_AUDIT_LOG:   1n << 13n,
} as const;

export type PermissionName = keyof typeof Permissions;

export const DEFAULT_PERMISSIONS =
  Permissions.SEND_MESSAGES |
  Permissions.CONNECT_VOICE |
  Permissions.SPEAK |
  Permissions.STREAM |
  Permissions.CREATE_INVITE |
  Permissions.ATTACH_FILES;

export const ALL_PERMISSIONS = Object.values(Permissions).reduce((a, b) => a | b, 0n);

export function hasPermission(userPerms: bigint, perm: bigint): boolean {
  if ((userPerms & Permissions.ADMIN) === Permissions.ADMIN) return true;
  return (userPerms & perm) === perm;
}

export function combinePermissions(...perms: bigint[]): bigint {
  return perms.reduce((a, b) => a | b, 0n);
}
