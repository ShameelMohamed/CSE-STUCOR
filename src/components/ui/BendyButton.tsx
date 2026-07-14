// src/components/ui/BendyButton.tsx
'use client'
import { useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

interface BendyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
}

export const BendyButton: React.FC<BendyButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    const span = spanRef.current;
    if (!btn || !span) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    const rotateY = px * 18;
    const rotateX = -py * 18;
    const scaleX = 1 + Math.abs(px) * 0.08;
    const scaleY = 1 + Math.abs(py) * 0.08;
    const r = 18;

    btn.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleX},${scaleY})`;
    btn.style.borderRadius = `${r + Math.abs(px) * 14}px ${r + Math.abs(py) * 14}px ${r + Math.abs(px) * 14}px ${r + Math.abs(py) * 14}px`;
    span.style.transform = `translate(${rotateY * 0.4}px,${-rotateX * 0.4}px)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    const span = spanRef.current;
    if (!btn || !span) return;
    btn.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    btn.style.borderRadius = '18px';
    span.style.transform = 'translate(0,0)';
  };

  const handleMouseDown = () => {
    if (btnRef.current) btnRef.current.style.transform = 'perspective(800px) scale(0.96)';
  };
  const handleMouseUp = () => {
    if (btnRef.current) btnRef.current.style.transform = 'perspective(800px) scale(1)';
  };

  const baseStyle = variant === 'danger'
    ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_18px_40px_rgba(239,68,68,0.35),inset_0_1px_rgba(255,255,255,0.2)]'
    : 'bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] shadow-[0_18px_40px_rgba(79,70,229,0.35),inset_0_1px_rgba(255,255,255,0.2)]';

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        'relative text-white font-bold cursor-pointer border-none select-none overflow-hidden',
        'py-4 px-8 text-base',
        'transition-[box-shadow] duration-200',
        'hover:shadow-[0_25px_60px_rgba(79,70,229,0.45),inset_0_1px_rgba(255,255,255,0.25)]',
        baseStyle,
        className
      )}
      style={{ transformStyle: 'preserve-3d', borderRadius: '18px', transition: 'box-shadow 0.2s ease' }}
      {...props}
    >
      <span ref={spanRef} className="flex items-center justify-center gap-3 transition-transform duration-200">
        {children}
      </span>
    </button>
  );
};