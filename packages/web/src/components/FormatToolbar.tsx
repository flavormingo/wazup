import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, CodeIcon } from './icons';

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  leading?: React.ReactNode;
}

interface FmtAction {
  label: string;
  icon: React.ReactNode;
  prefix: string;
  suffix: string;
}

const actions: FmtAction[] = [
  { label: 'bold', icon: <BoldIcon size={16} />, prefix: '**', suffix: '**' },
  { label: 'italic', icon: <ItalicIcon size={16} />, prefix: '*', suffix: '*' },
  { label: 'underline', icon: <UnderlineIcon size={16} />, prefix: '__', suffix: '__' },
  { label: 'strikethrough', icon: <StrikethroughIcon size={16} />, prefix: '~~', suffix: '~~' },
  { label: 'code', icon: <CodeIcon size={16} />, prefix: '`', suffix: '`' },
];

export function FormatToolbar({ textareaRef, value, onChange, leading }: Props) {
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
      {leading}
      {actions.map((a) => (
        <button
          key={a.label}
          className="fmt-btn icon-btn"
          aria-label={a.label}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => apply(a)}
        >
          {a.icon}
        </button>
      ))}
    </div>
  );
}
