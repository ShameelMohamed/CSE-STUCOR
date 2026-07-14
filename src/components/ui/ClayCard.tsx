// src/components/ui/ClayCard.tsx
'use client'
import { useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
  // Enable 3D mouse tracking tilt for feature/hero cards
  tilt?: boolean;
  // Disable entrance animation (useful when parent already animates)
  noEntrance?: boolean;
}

export const ClayCard: React.FC<ClayCardProps> = ({ children, className, tilt = false, noEntrance = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
  };

  const handleMouseLeave = () => {
    if (!tilt || !cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  const entranceProps = noEntrance ? {} : {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -5 }}
      {...entranceProps}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        // Surface color
        'bg-[#F3F4F7] dark:bg-[#27272A]',
        // Rounded clay shape
        'rounded-[28px]',
        // Light mode: soft outer drop shadow + bright top-left inner highlight
        'shadow-[0_8px_32px_rgba(160,172,201,0.45),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-3px_8px_rgba(160,172,201,0.2)]',
        // Dark mode: deep outer shadow + very subtle top edge glow
        'dark:shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_rgba(255,255,255,0.06),inset_0_-2px_6px_rgba(0,0,0,0.35)]',
        'p-6',
        tilt && 'transition-transform duration-200',
        className
      )}
    >
      {children}
    </motion.div>
  );
};
