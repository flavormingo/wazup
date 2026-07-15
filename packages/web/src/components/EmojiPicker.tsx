import { useRef, useState, useLayoutEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClose } from '../hooks/useOutsideClose';
import { EMOJI_CATEGORIES } from '../lib/emojiData';
import './EmojiPicker.css';

interface Props {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  placement?: 'up-left' | 'up-right' | 'down-right';
}

const PW = 320;
const PH = 360;
const GAP = 6;
const EDGE = 8;

export function EmojiPicker({ onSelect, onClose, placement = 'up-left' }: Props) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', visibility: 'hidden' });
  useOutsideClose(ref, onClose);

  useLayoutEffect(() => {
    const a = anchorRef.current;
    if (!a) return;
    const r = a.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(PW, vw - EDGE * 2);
    const spaceAbove = r.top - GAP - EDGE;
    const spaceBelow = vh - r.bottom - GAP - EDGE;
    let openUp = placement.startsWith('up');
    if (openUp && spaceAbove < 220 && spaceBelow > spaceAbove) openUp = false;
    if (!openUp && spaceBelow < 220 && spaceAbove > spaceBelow) openUp = true;
    const avail = openUp ? spaceAbove : spaceBelow;
    const height = Math.max(160, Math.min(PH, avail));
    const top = openUp ? r.top - GAP - height : r.bottom + GAP;
    let left = placement.endsWith('right') ? r.right - width : r.left;
    left = Math.max(EDGE, Math.min(left, vw - width - EDGE));
    setStyle({ position: 'fixed', top: Math.max(EDGE, top), left, width, height });
  }, [placement]);

  const jumpTo = (i: number) => {
    const el = sectionRefs.current[i];
    const sc = scrollRef.current;
    if (el && sc) sc.scrollTop = el.offsetTop;
  };

  return (
    <>
      <span ref={anchorRef} className="emoji-anchor" aria-hidden="true" />
      {createPortal(
        <div className="emoji-picker" ref={ref} style={style}>
          <div className="emoji-nav">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                className="emoji-nav-btn"
                aria-label={cat.name}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => jumpTo(i)}
              >
                {cat.icon}
              </button>
            ))}
          </div>
          <div className="emoji-scroll" ref={scrollRef}>
            {EMOJI_CATEGORIES.map((cat, i) => (
              <div
                key={cat.name}
                className="emoji-section"
                ref={(el) => { sectionRefs.current[i] = el; }}
              >
                <div className="label overline">{cat.name}</div>
                <div className="grid">
                  {cat.emojis.map((e) => (
                    <button
                      key={e}
                      className="btn"
                      onMouseDown={(ev) => ev.preventDefault()}
                      onClick={() => onSelect(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
