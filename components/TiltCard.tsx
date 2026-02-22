'use client';

import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useMousePosition } from '@/src/hooks/useMousePosition';
import { useElementRect } from '@/src/hooks/useElementRect';

const MAX_TILT = 8;
const SMOOTH = 0.12;

export default function TiltCard({
  children,
  className = '',
  style = {},
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useElementRect(ref);
  const { x, y } = useMousePosition();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    let raf: number;
    const loop = () => {
      if (!rect) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = (x - centerX) / (rect.width / 2);
      const relY = (y - centerY) / (rect.height / 2);
      const targetX = Math.max(-1, Math.min(1, relX)) * MAX_TILT;
      const targetY = Math.max(-1, Math.min(1, relY)) * -MAX_TILT;
      setTilt((prev) => ({
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
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
