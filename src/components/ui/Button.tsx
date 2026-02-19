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
    "bg-gradient-to-r from-pjazza-gold to-pjazza-honey text-white shadow-lg hover:opacity-90",
  live: "bg-live text-white animate-live-pulse hover:opacity-90",
  success: "bg-trust text-white hover:opacity-90",
  ghost:
    "bg-transparent border border-line text-ink hover:bg-surface-alt",
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
    "py-3 rounded-xl font-extrabold text-sm inline-flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed";

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
