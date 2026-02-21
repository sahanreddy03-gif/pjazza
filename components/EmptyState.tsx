'use client';

import { LucideIcon } from 'lucide-react';

export default function EmptyState({
  Icon,
  title,
  description,
  action,
}: {
  Icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="pj-card"
      style={{
        padding: 48,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--pj-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--pj-border)',
        }}
      >
        <Icon size={28} strokeWidth={1.5} style={{ color: 'var(--pj-text-tertiary)' }} />
      </div>
      <h3 style={{ fontSize: 'var(--pj-size-h3)', fontWeight: 700, color: 'var(--pj-text)' }}>{title}</h3>
      {description && (
        <p style={{ fontSize: 'var(--pj-size-small)', color: 'var(--pj-text-tertiary)', maxWidth: 320, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
