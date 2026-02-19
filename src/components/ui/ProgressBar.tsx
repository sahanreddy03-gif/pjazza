/**
 * ProgressBar — height, percentage, color. Animated width transition.
 * @see docs/REFERENCE.md section 4.3
 */

interface ProgressBarProps {
  percentage: number;
  height?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const heightClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  percentage,
  height = "sm",
  color = "bg-trust",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div
      className={`w-full rounded-full bg-line-light overflow-hidden ${heightClasses[height]} ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
