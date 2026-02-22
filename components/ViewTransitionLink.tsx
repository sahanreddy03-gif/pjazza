'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode } from 'react';

type ViewTransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
};

export default function ViewTransitionLink({
  href,
  children,
  className = '',
  style = {},
  ...props
}: ViewTransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as unknown as { startViewTransition: (cb: () => Promise<void> | void) => Promise<void> })
        .startViewTransition(() => router.push(href));
    } else {
      router.push(href);
    }
  };

  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
