/**
 * LivePulse — animated red dot for live indicators
 * @see docs/REFERENCE.md section 4.3
 */

interface LivePulseProps {
  className?: string;
}

export function LivePulse({ className = "" }: LivePulseProps) {
  return (
    <span className={`relative inline-block w-2 h-2 ${className}`}>
      <span className="absolute inset-0 rounded-full bg-live/50 animate-ping" />
      <span className="relative block w-2 h-2 rounded-full bg-live" />
    </span>
  );
}
