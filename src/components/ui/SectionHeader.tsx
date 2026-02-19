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
        <h2 className="text-[17px] font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[13px] text-ink-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="text-[13px] font-medium text-info hover:opacity-80 shrink-0 transition-opacity"
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
