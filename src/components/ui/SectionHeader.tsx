/**
 * SectionHeader — title, subtitle, optional action link
 */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div>
        <h2 className="text-base font-extrabold tracking-tight text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="text-xs font-semibold text-pjazza-gold hover:underline shrink-0"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
