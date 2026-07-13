interface Reaction {
  emoji: string;
  count: number;
  me: boolean;
}

interface Props {
  reactions?: Reaction[];
  onToggle: (emoji: string) => void;
}

export function MessageReactions({ reactions, onToggle }: Props) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div className="reactions">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          className={`reaction ${r.me ? 'me' : ''}`}
          onClick={() => onToggle(r.emoji)}
          title={r.me ? 'remove reaction' : 'react'}
        >
          <span className="emoji">{r.emoji}</span>
          <span className="count">{r.count}</span>
        </button>
      ))}
    </div>
  );
}
