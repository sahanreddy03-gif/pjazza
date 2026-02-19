/**
 * Button — variants: primary, live, success, ghost. Full-width option.
 * @see docs/REFERENCE.md section 4.3
 */

import type { ReactNode } from "react";

type ButtonVariant = "primary" | "live" | "success" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white hover:opacity-90 active:opacity-95 shadow-card",
  live: "bg-live text-white animate-live-pulse hover:opacity-90 active:opacity-95",
  success: "bg-trust text-white hover:opacity-90 active:opacity-95",
  ghost:
    "bg-transparent border border-line text-ink hover:bg-surface-alt active:bg-surface-alt",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  type = "button",
  disabled = false,
  className = "",
  onClick,
  href,
}: ButtonProps) {
  const base =
    "py-3.5 rounded-apple font-semibold text-[15px] inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClass = variantClasses[variant];
  const widthClass = fullWidth ? "w-full" : "";

  const combined = `${base} ${variantClass} ${widthClass} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={combined}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combined}
    >
      {children}
    </button>
  );
}
