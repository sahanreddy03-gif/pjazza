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
    "bg-white rounded-apple p-4 shadow-card transition-all duration-200";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} text-left w-full hover:shadow-card-hover active:scale-[0.99] cursor-pointer ${className}`}
      >
        {children}
      </button>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
