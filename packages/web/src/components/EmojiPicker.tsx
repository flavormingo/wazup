import { useRef, useEffect } from 'react';
import './EmojiPicker.css';

interface Props {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  placement?: 'up-left' | 'up-right' | 'down-right';
}

const CATEGORIES: { name: string; emojis: string[] }[] = [
  {
    name: 'smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
      '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋',
      '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🫡',
      '😐', '😑', '😶', '🫥', '😏', '😒', '🙄', '😬', '🤥', '😌',
      '😴', '🤤', '😷', '🤒', '🤕', '🤧', '🥵', '🥶', '🥴', '😵',
      '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😈', '👿',
    ],
  },
  {
    name: 'gestures',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '🫱', '👌', '🤌', '🤏', '✌️',
      '🤞', '🫰', '🤟', '🤙', '👍', '👎', '👏', '🙌', '🫶', '💪', '🫂',
    ],
  },
  {
    name: 'animals',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦅', '🦉',
    ],
  },
  {
    name: 'food',
    emojis: [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒',
      '🍕', '🍔', '🍟', '🌮', '🍜', '🍣', '🍩', '🍪', '☕', '🍺',
    ],
  },
  {
    name: 'objects',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💯',
      '⭐', '🌟', '✨', '⚡', '🔥', '💎', '🎵', '🎶', '🎮', '🏆',
    ],
  },
];

export function EmojiPicker({ onSelect, onClose, placement = 'up-left' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  return (
    <div className={`emoji-picker ${placement}`} ref={ref}>
      {CATEGORIES.map((cat) => (
        <div key={cat.name}>
          <div className="label overline">{cat.name}</div>
          <div className="grid">
            {cat.emojis.map((e) => (
              <button key={e} className="btn" onClick={() => onSelect(e)}>
                {e}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
