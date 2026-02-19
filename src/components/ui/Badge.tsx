/**
 * Badge — inline label with configurable bg/color
 * @see docs/REFERENCE.md section 4.3
 */

import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  /** Tailwind bg class, e.g. bg-trust, bg-live, bg-ink-muted */
  bg?: string;
  /** Tailwind text color, e.g. text-white, text-ink */
  color?: string;
}

export function Badge({
  children,
  className = "",
  bg = "bg-surface-alt",
  color = "text-ink",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${bg} ${color} ${className}`}
    >
      {children}
    </span>
  );
}
