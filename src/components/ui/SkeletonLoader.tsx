'use client'
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className }: SkeletonProps) => (
  <motion.div
    className={cn('rounded-2xl bg-[#E0E2EA] dark:bg-[#323238]', className)}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
  />
);

export const PostCardSkeleton = () => (
  <div
    className={cn(
      'w-full p-6 rounded-[28px] flex flex-col gap-4',
      'bg-[#F3F4F7] dark:bg-[#27272A]',
      'shadow-[0_8px_32px_rgba(160,172,201,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)]',
      'dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.06)]'
    )}
  >
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-3/5" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'p-6 rounded-[28px] flex items-start gap-5',
          'bg-[#F3F4F7] dark:bg-[#27272A]',
          'shadow-[0_8px_32px_rgba(160,172,201,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)]',
          'dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_rgba(255,255,255,0.06)]'
        )}
      >
        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    ))}
  </div>
);
