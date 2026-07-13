interface IconProps {
  size?: number;
  className?: string;
}

const S = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function HashIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M10 3L6 21" />
      <path d="M20.5 16H2.5" />
      <path d="M22 7H4" />
      <path d="M18 3L14 21" />
    </svg>
  );
}

export function VolumeIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M1 13.857V10.143C1 9.038 1.895 8.143 3 8.143H5.9c.196 0 .387-.058.55-.165L12.45 4.022C13.114 3.584 14 4.061 14 4.857v14.286c0 .796-.886 1.273-1.55.835L6.45 16.022a1.005 1.005 0 00-.55-.165H3c-1.105 0-2-.896-2-2z" />
      <path d="M17.5 7.5s1.5 1.5 1.5 4-1.5 4-1.5 4" />
      <path d="M20.5 4.5s2.5 2.5 2.5 7-2.5 7-2.5 7" />
    </svg>
  );
}

export function PlusIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M6 12h6m6 0h-6m0 0V6m0 6v6" />
    </svg>
  );
}

export function SendIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M22.152 3.553L11.177 21.004l-1.67-8.596L2 7.898l20.152-4.345z" />
      <path d="M9.456 12.444L22.152 3.553" />
    </svg>
  );
}


export function MicIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10v1c0 3.866 3.134 7 7 7s7-3.134 7-7v-1" />
      <path d="M12 18v4m0 0H9m3 0h3" />
    </svg>
  );
}

export function MicMutedIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M3 3l18 18" />
      <path d="M9 9c0 2.761 2.239 5 5 5m1-3.5V5a3 3 0 00-6 0v.5" />
      <path d="M5 10v1c0 3.866 3.134 7 7 7s7-3.134 7-7v-1" />
      <path d="M12 18v4m0 0H9m3 0h3" />
    </svg>
  );
}

export function HeadphonesIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M4 13.5l-.485.121A2.328 2.328 0 002 15.561v1.877c0 .917.625 1.717 1.515 1.94l1.74.435A.374.374 0 006 19.231v-5.463a.374.374 0 00-.255-.354L4 13.5zm0 0V13c0-4.97 3.582-9 8-9s8 4.03 8 9v.5m0 0l.485.121A2.328 2.328 0 0122 15.561v1.877c0 .917-.625 1.717-1.515 1.94l-1.74.435A.374.374 0 0118 19.231v-5.463c0-.161.103-.304.255-.354L20 13.5z" />
    </svg>
  );
}

export function PhoneIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M18.118 14.702L14 15.5c-2.782-1.396-4.5-3-5.5-5.5l.77-4.13L7.815 2H4.064c-1.128 0-2.016.932-1.847 2.047.42 2.783 1.66 7.83 5.283 11.453 3.805 3.805 9.286 5.457 12.302 6.113C20.967 21.866 22 20.957 22 19.766V16.18l-3.882-1.478z" />
    </svg>
  );
}

export function XIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M6.758 17.243L12.001 12m5.243-5.243L12.001 12m0 0L6.758 6.757M12.001 12l5.243 5.243" />
    </svg>
  );
}

export function UsersIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M1 20v-1c0-3.866 3.134-7 7-7s7 3.134 7 7v1" />
      <path d="M13 14c0-2.761 2.239-5 5-5s5 2.239 5 5v.5" />
      <path d="M8 12a4 4 0 100-8 4 4 0 000 8z" />
      <path d="M18 9a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );
}

export function PaperclipIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M21.438 11.662l-9.19 9.19a5.768 5.768 0 01-8.144 0 5.768 5.768 0 010-8.144l9.19-9.19a3.846 3.846 0 015.46 0 3.846 3.846 0 010 5.46l-9.2 9.19a1.923 1.923 0 01-2.83 0 1.923 1.923 0 010-2.83l8.49-8.48" />
    </svg>
  );
}

export function ScreenIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M7 21h10" />
      <path d="M2 16.4V3.6a.6.6 0 01.6-.6h18.8a.6.6 0 01.6.6v12.8a.6.6 0 01-.6.6H2.6a.6.6 0 01-.6-.6z" />
    </svg>
  );
}

export function SignOutIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 12h7m0 0l-3 3m3-3l-3-3" />
      <path d="M19 6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2v-1" />
    </svg>
  );
}

export function TrashIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M20 9l-1.995 11.346A2 2 0 0116.035 22H7.965a2 2 0 01-1.97-1.654L4 9" />
      <path d="M21 6h-5.625m-12.375 0h5.625m0 0V4a2 2 0 012-2h2.75a2 2 0 012 2v2m-6.75 0h6.75" />
    </svg>
  );
}

export function EditIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M14.363 5.652l1.48-1.48a1.818 1.818 0 012.829 0l1.414 1.414a1.818 1.818 0 010 2.829l-1.48 1.48m-4.243-4.243l-9.616 9.616a1.996 1.996 0 00-.578 1.238l-.242 2.74a.546.546 0 00.597.598l2.74-.242c.467-.041.906-.247 1.239-.578l9.616-9.616m-4.243-4.243l4.243 4.243" />
    </svg>
  );
}

export function LinkIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M14 12c0-2.492-2.317-4.998-5.143-4.998-.335 0-1.438 0-1.714 0C4.303 7.002 2 9.238 2 11.998c0 2.378 1.71 4.369 4 4.874.368.081.75.124 1.143.124" />
      <path d="M10 12c0 2.491 2.317 4.995 5.143 4.995.335 0 1.438 0 1.714 0 2.84 0 5.143-2.237 5.143-4.997 0-2.379-1.71-4.37-4-4.874A5.18 5.18 0 0016.857 7" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function CameraIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M15 12v4.4a.6.6 0 01-.6.6H3.6a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6h10.8a.6.6 0 01.6.6V12zm0 0l5.016-4.18A.4.4 0 0121 8.281v7.438a.4.4 0 01-.984.32L15 12z" />
    </svg>
  );
}

export function CameraOffIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M6.5 7H3.6a.6.6 0 00-.6.6v8.8a.6.6 0 00.6.6h10.8a.6.6 0 00.6-.6V15m-3.5-8h2.9a.6.6 0 01.6.6v3.119a.4.4 0 00.984.32L20.016 7.82A.4.4 0 0121 8.281V15.5" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

export function CommentsIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M17 12.5a.5.5 0 10 0-1 .5.5 0 000 1z" fill="currentColor" />
      <path d="M12 12.5a.5.5 0 100-1 .5.5 0 000 1z" fill="currentColor" />
      <path d="M7 12.5a.5.5 0 100-1 .5.5 0 000 1z" fill="currentColor" />
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5 7 20.662A9.955 9.955 0 0012 22z" />
    </svg>
  );
}

export function MessageTextIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M3 20.29V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H7.961a2 2 0 00-1.561.75l-2.331 2.914A.6.6 0 013 20.29z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

export function MultiBubbleIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M7.5 22C10.5376 22 13 19.5376 13 16.5C13 13.4624 10.5376 11 7.5 11C4.46243 11 2 13.4624 2 16.5C2 17.5018 2.26783 18.441 2.7358 19.25L2.275 21.725L4.75 21.2642C5.55898 21.7322 6.49821 22 7.5 22Z" />
      <path d="M15.2824 17.8978C16.2587 17.7405 17.1758 17.4065 18 16.9297L21.6 17.6L20.9297 14C21.6104 12.8233 22 11.4571 22 10C22 5.58172 18.4183 2 14 2C9.97262 2 6.64032 4.97598 6.08221 8.84884" />
    </svg>
  );
}

export function UserPlusIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M17 10h3m3 0h-3m0 0V7m0 3v3" />
      <path d="M1 20v-1c0-3.866 3.134-7 7-7s7 3.134 7 7v1" />
      <path d="M8 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

export function UserXmarkIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M18 8l4 4m0-4l-4 4" />
      <path d="M1 20v-1c0-3.866 3.134-7 7-7s7 3.134 7 7v1" />
      <path d="M8 12a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

export function SearchIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M17 17l4 4" />
      <path d="M3 11a8 8 0 1016 0 8 8 0 00-16 0z" />
    </svg>
  );
}

export function LocationIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1116 0z" />
      <path d="M12 11a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ImageUploadIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 16V8m0 0l-3 3m3-3l3 3" />
      <path d="M3 20.4V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6v16.8a.6.6 0 01-.6.6H3.6a.6.6 0 01-.6-.6z" />
    </svg>
  );
}

const F = { fill: 'currentColor' };

export function DribbbleIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm7.938 5.563a10.18 10.18 0 012.25 6.375c-.328-.063-3.625-.75-6.938-.313-.063-.187-.125-.313-.188-.5-.187-.438-.375-.875-.625-1.313 3.688-1.5 5.313-3.688 5.5-4.25zM12 1.812c2.813 0 5.375 1.125 7.25 2.938-.188.5-1.625 2.563-5.188 3.875C12.188 5.312 10.125 2.75 9.812 2.312c.688-.312 1.438-.5 2.188-.5zM7.875 3.062c.25.375 2.313 3 4.188 6.25-5.313 1.438-9.938 1.375-10.438 1.375.688-3.375 3.188-6.188 6.25-7.625zM1.813 12v-.375c.5.063 6 .125 11.625-1.625.313.688.625 1.313.938 2-.125.063-.313.063-.438.125-5.875 1.875-8.938 7.125-9.188 7.5A10.144 10.144 0 011.813 12zm4.125 8.125c.125-.313 2.437-4.875 8.75-7.125.063 0 .063 0 .125-.063 1.563 4.063 2.188 7.438 2.375 8.5a10.269 10.269 0 01-11.25-1.312zm13.062.188c-.125-.75-.688-3.938-2.188-8 3.063-.5 5.75.313 6.063.438a10.192 10.192 0 01-3.875 7.562z" />
    </svg>
  );
}

export function FacebookIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export function GithubIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function MediumIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

export function PinterestIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
    </svg>
  );
}

export function SnapchatIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.04-.012.06-.012.08-.012.12 0 .24.036.36.084a.73.73 0 01.38.66c-.01.12-.06.27-.18.39-.12.12-.27.18-.42.24-.09.03-.24.06-.39.12-.18.06-.39.12-.6.21-.21.09-.42.21-.6.39-.18.18-.3.42-.3.66 0 .03.012.06.018.09.24.51.6.99 1.02 1.41.42.42.9.78 1.38 1.05.24.12.48.21.72.27.12.03.24.06.3.09.06.03.12.06.15.12.45.66.12 1.5-.39 1.65-.18.06-.39.12-.63.15-.12.03-.24.03-.36.06-.24.03-.48.09-.72.15a.78.78 0 00-.42.3c-.06.12-.12.24-.18.39-.12.24-.24.48-.45.66-.42.36-1.02.36-1.56.3-.3-.03-.6-.09-.87-.21-.39-.12-.78-.3-1.23-.3-.06 0-.12 0-.21.012-.72.06-1.38.54-2.07.96-.9.54-1.83.96-2.94.96-1.08 0-2.01-.42-2.91-.96-.66-.42-1.32-.87-2.04-.96-.06-.012-.12-.012-.21-.012-.45 0-.84.18-1.23.3-.27.12-.57.18-.87.21-.54.06-1.14.06-1.56-.3-.21-.18-.33-.42-.45-.66-.06-.15-.12-.27-.18-.39a.78.78 0 00-.42-.3c-.24-.06-.48-.12-.72-.15-.12-.03-.24-.03-.36-.06-.24-.03-.45-.09-.63-.15-.51-.15-.84-.99-.39-1.65.03-.06.09-.09.15-.12.06-.03.18-.06.3-.09.24-.06.48-.15.72-.27.48-.27.96-.63 1.38-1.05.42-.42.78-.9 1.02-1.41.006-.03.018-.06.018-.09 0-.24-.12-.48-.3-.66-.18-.18-.39-.3-.6-.39-.21-.09-.42-.15-.6-.21-.15-.06-.3-.09-.39-.12-.15-.06-.3-.12-.42-.24a.694.694 0 01-.18-.39.73.73 0 01.38-.66c.12-.048.24-.084.36-.084.02 0 .04 0 .08.012.27.09.63.21.93.21.18 0 .33-.045.39-.09-.005-.165-.018-.33-.03-.51l-.003-.06c-.105-1.628-.231-3.654.299-4.847C6.859 1.069 10.216.793 11.206.793h1z" />
    </svg>
  );
}

export function StackOverflowIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.72-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.905-1.94-9.702-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.254v2.133h10.66v-2.133H6.154z" />
    </svg>
  );
}

export function TelegramIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function ThreadsIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.228 1.33-2.93.88-.67 2.06-1.04 3.32-1.04.88 0 1.69.14 2.42.43-.06-.65-.24-1.19-.53-1.61-.39-.56-1-.87-1.82-.93-.63-.04-1.24.07-1.72.32l-.94-1.81c.78-.41 1.77-.63 2.86-.57 1.2.07 2.15.52 2.83 1.35.58.72.94 1.66 1.05 2.79.46.2.88.44 1.27.72 1.09.77 1.87 1.79 2.3 3.03.75 2.15.56 4.84-1.69 7.05C18.198 23.166 15.59 23.972 12.186 24zm.53-8.326c-.89 0-1.63.19-2.15.56-.42.3-.63.7-.6 1.16.04.58.36 1.06.92 1.42.61.39 1.41.56 2.25.52 1.08-.06 1.9-.44 2.46-1.13.44-.55.74-1.3.88-2.24-.57-.2-1.17-.29-1.76-.29z" />
    </svg>
  );
}

export function TiktokIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function YoutubeIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function XPlatformIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...F}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
    </svg>
  );
}

export function GlobalLinkIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function CrownIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M2 17l1-10 5 4 4-7 4 7 5-4 1 10H2z" />
      <path d="M2 17h20v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2z" />
    </svg>
  );
}

export function FlareIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 2l2.09 6.26L20 10.27l-4.91 3.82L16.18 22 12 18.27 7.82 22l1.09-7.91L4 10.27l5.91-2.01L12 2z" />
    </svg>
  );
}

export function GearIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...S}>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.622 10.395l-1.097-2.65L20 6l-2-2-1.735 1.483-2.707-1.113L12.935 2h-1.954l-.632 2.401-2.645 1.115L6 4 4 6l1.453 1.789-1.08 2.657L2 11v2l2.401.655 1.113 2.707L4 18l2 2 1.791-1.46 2.606 1.072L11 22h2l.604-2.387 2.651-1.098L18 20l2-2-1.484-1.734 1.098-2.652L22 13v-2l-2.378-.605z" />
    </svg>
  );
}

export function FaceSmileIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" className={className}>
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1-64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
    </svg>
  );
}

export function FolderIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" className={className}>
      <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" />
    </svg>
  );
}
