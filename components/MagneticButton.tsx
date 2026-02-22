'use client';

import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useMousePosition } from '@/src/hooks/useMousePosition';
import { useElementRect } from '@/src/hooks/useElementRect';

const PULL = 12;
const SMOOTH = 0.2;

export default function MagneticButton({
  children,
  className = '',
  style = {},
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const rect = useElementRect(ref);
  const { x, y } = useMousePosition();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || !rect) return;
    let raf: number;
    const loop = () => {
      if (!rect) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (x - centerX) / rect.width;
      const distY = (y - centerY) / rect.height;
      const targetX = Math.max(-1, Math.min(1, distX)) * PULL;
      const targetY = Math.max(-1, Math.min(1, distY)) * PULL;
      setOffset((prev) => ({
        x: prev.x + (targetX - prev.x) * SMOOTH,
        y: prev.y + (targetY - prev.y) * SMOOTH,
      }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isHovered, rect, x, y]);

  const onEnter = useCallback(() => setIsHovered(true), []);
  const onLeave = useCallback(() => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      style={{
        ...style,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
