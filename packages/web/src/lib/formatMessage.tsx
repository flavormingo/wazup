import { type ReactNode } from 'react';

const URL_RE = /https?:\/\/[^\s<>\[\]()]+(?:\([^\s<>]*\))?[^\s<>\[\]().,;:!?"')\]}>]*/g;

interface Token {
  type: 'text' | 'bold' | 'italic' | 'strikethrough' | 'code' | 'codeblock' | 'underline' | 'link' | 'bolditalic';
  content: string;
  lang?: string;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let match: RegExpMatchArray | null;

    if ((match = remaining.match(/^```(\w*)\n?([\s\S]*?)```/))) {
      tokens.push({ type: 'codeblock', content: match[2], lang: match[1] || undefined });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^`([^`\n]+?)`/))) {
      tokens.push({ type: 'code', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^\*\*\*(.+?)\*\*\*/s))) {
      tokens.push({ type: 'bolditalic', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^\*\*(.+?)\*\*/s))) {
      tokens.push({ type: 'bold', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^__(.+?)__/s))) {
      tokens.push({ type: 'underline', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^\*([^\s*](?:[^*]*[^\s*])?)\*/))) {
      tokens.push({ type: 'italic', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^_([^\s_](?:[^_]*[^\s_])?)_/))) {
      tokens.push({ type: 'italic', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    if ((match = remaining.match(/^~~(.+?)~~/s))) {
      tokens.push({ type: 'strikethrough', content: match[1] });
      remaining = remaining.slice(match[0].length);
      continue;
    }

    const urlMatch = remaining.match(URL_RE);
    if (urlMatch && remaining.indexOf(urlMatch[0]) === 0) {
      tokens.push({ type: 'link', content: urlMatch[0] });
      remaining = remaining.slice(urlMatch[0].length);
      continue;
    }

    let nextSpecial = remaining.length;
    const patterns = [/```/, /`[^`]/, /\*\*\*/, /\*\*/, /__/, /\*[^\s*]/, /_[^\s_]/, /~~/, URL_RE];
    for (const p of patterns) {
      const m = remaining.slice(1).search(p);
      if (m !== -1 && m + 1 < nextSpecial) {
        nextSpecial = m + 1;
      }
    }

    tokens.push({ type: 'text', content: remaining.slice(0, nextSpecial) });
    remaining = remaining.slice(nextSpecial);
  }

  return tokens;
}

function linkifyText(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  URL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = URL_RE.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    parts.push(
      <a key={`${keyBase}-l${matchIndex++}`} href={m[0]} target="_blank" rel="noopener noreferrer" className="msg-link">{m[0]}</a>
    );
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : [text];
}

export function formatMessage(content: string): ReactNode {
  const tokens = tokenize(content);

  if (tokens.length === 1 && tokens[0].type === 'text') {
    const linked = linkifyText(content, 'r');
    if (linked.length === 1 && typeof linked[0] === 'string') {
      return content;
    }
    return <>{linked}</>;
  }

  return (
    <>
      {tokens.map((token, i) => {
        switch (token.type) {
          case 'bold':
            return <strong key={i}>{linkifyText(token.content, `b${i}`)}</strong>;
          case 'italic':
            return <em key={i}>{linkifyText(token.content, `i${i}`)}</em>;
          case 'bolditalic':
            return <strong key={i}><em>{linkifyText(token.content, `bi${i}`)}</em></strong>;
          case 'underline':
            return <u key={i}>{linkifyText(token.content, `u${i}`)}</u>;
          case 'strikethrough':
            return <s key={i}>{linkifyText(token.content, `s${i}`)}</s>;
          case 'code':
            return <code key={i}>{token.content}</code>;
          case 'codeblock':
            return <pre key={i} className="msg-codeblock"><code>{token.content}</code></pre>;
          case 'link':
            return <a key={i} href={token.content} target="_blank" rel="noopener noreferrer" className="msg-link">{token.content}</a>;
          default:
            return <span key={i}>{linkifyText(token.content, `t${i}`)}</span>;
        }
      })}
    </>
  );
}
