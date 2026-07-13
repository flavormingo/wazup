interface Props {
  size?: number;
  className?: string;
}

export function WormMark({ size = 72, className }: Props) {
  return (
    <img
      src="/wazup-mark.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={Math.round((size * 642) / 940)}
      className={`worm-mark ${className ?? ''}`}
    />
  );
}
