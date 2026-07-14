// src/components/ui/EmptyState.tsx
import { motion } from 'framer-motion';
import { Ghost, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: 'inbox' | 'ghost';
  className?: string;
}

export const EmptyState = ({
  message = 'Nothing to see here yet',
  subMessage,
  icon = 'inbox',
  className,
}: EmptyStateProps) => {
  const Icon = icon === 'ghost' ? Ghost : Inbox;

  return (
    <div className={cn('w-full flex flex-col items-center justify-center py-20 px-4 text-center', className)}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.7 }}
        className={cn(
          'w-24 h-24 rounded-[28px] flex items-center justify-center mb-6',
          'bg-[#F3F4F7] dark:bg-[#27272A]',
          'shadow-[0_8px_24px_rgba(160,172,201,0.35),inset_0_1px_1px_rgba(255,255,255,0.9)]',
          'dark:shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.06)]'
        )}
      >
        <Icon className="w-10 h-10 text-[#94A3B8] dark:text-[#52525B]" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-bold text-[#1E293B] dark:text-[#FAFAFA] mb-2"
      >
        {message}
      </motion.h3>
      {subMessage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#64748B] dark:text-[#71717A] max-w-sm text-sm leading-relaxed"
        >
          {subMessage}
        </motion.p>
      )}
    </div>
  );
};
