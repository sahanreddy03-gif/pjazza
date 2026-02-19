/**
 * Card — white bg, border, rounded-xl, optional click handler
 * @see docs/REFERENCE.md section 4.3
 */

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  onClick,
}: CardProps) {
  const base =
    "bg-surface-card border border-line rounded-xl p-3 transition-colors";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} text-left w-full hover:bg-surface-alt cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
