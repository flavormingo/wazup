interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
}

interface FmtAction {
  label: string;
  icon: React.ReactNode;
  prefix: string;
  suffix: string;
}

const actions: FmtAction[] = [
  {
    label: 'bold',
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 2.8 6.85A4.5 4.5 0 0 1 15.5 20H6V4zm3 7h5a1.5 1.5 0 0 0 0-3H9v3zm0 3v4h6.5a1.5 1.5 0 0 0 0-3H9z"/></svg>,
    prefix: '**',
    suffix: '**',
  },
  {
    label: 'italic',
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M10 4h10v3h-3.5l-5 10H15v3H5v-3h3.5l5-10H10V4z"/></svg>,
    prefix: '*',
    suffix: '*',
  },
  {
    label: 'underline',
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v7a5 5 0 0 0 10 0V4h3v7a8 8 0 0 1-16 0V4h3zM4 20h16v2H4v-2z"/></svg>,
    prefix: '__',
    suffix: '__',
  },
  {
    label: 'strikethrough',
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M17.15 8.65c0-2.95-2.3-4.65-5.65-4.65-3.15 0-5.6 1.55-5.8 4.35h3.3c.15-1.15 1-1.85 2.5-1.85 1.55 0 2.35.7 2.35 1.75 0 .65-.3 1.15-1.1 1.5l-.25.1H3v2.5h18v-2.5h-5.1c.15-.35.25-.75.25-1.2zM8.5 15.5c0 1.7 1.3 2.85 3.5 2.85 1.85 0 3.15-.75 3.65-2.1h-3.3c-.2.3-.6.5-1.15.5-.75 0-1.3-.4-1.4-1.25H8.5z"/></svg>,
    prefix: '~~',
    suffix: '~~',
  },
  {
    label: 'code',
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    prefix: '`',
    suffix: '`',
  },
];

export function FormatToolbar({ textareaRef, value, onChange }: Props) {
  const apply = (action: FmtAction) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const pLen = action.prefix.length;
    const sLen = action.suffix.length;

    const hasBefore = value.slice(start - pLen, start) === action.prefix;
    const hasAfter = value.slice(end, end + sLen) === action.suffix;
    if (hasBefore && hasAfter) {
      const unwrapped = value.slice(0, start - pLen) + value.slice(start, end) + value.slice(end + sLen);
      onChange(unwrapped);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start - pLen, end - pLen);
      });
      return;
    }

    const selected = value.slice(start, end);
    if (selected.startsWith(action.prefix) && selected.endsWith(action.suffix) && selected.length >= pLen + sLen) {
      const inner = selected.slice(pLen, -sLen);
      const unwrapped = value.slice(0, start) + inner + value.slice(end);
      onChange(unwrapped);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start, start + inner.length);
      });
      return;
    }

    const before = value.slice(0, start);
    const after = value.slice(end);
    const wrapped = `${action.prefix}${selected || 'text'}${action.suffix}`;

    onChange(before + wrapped + after);

    requestAnimationFrame(() => {
      ta.focus();
      if (selected) {
        ta.setSelectionRange(start + pLen, end + pLen);
      } else {
        ta.setSelectionRange(start + pLen, start + pLen + 4);
      }
    });
  };

  return (
    <div className="format-toolbar">
      {actions.map((a) => (
        <button
          key={a.label}
          className="fmt-btn icon-btn"
          title={a.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => apply(a)}
        >
          {a.icon}
        </button>
      ))}
    </div>
  );
}
