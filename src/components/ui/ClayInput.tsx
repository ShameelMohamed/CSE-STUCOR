// src/components/ui/ClayInput.tsx
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

export interface ClayInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const ClayInput = forwardRef<HTMLInputElement, ClayInputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-[#1E293B] dark:text-[#FAFAFA] ml-1">
            {label}
          </label>
        )}
        <input
          id={id}
          className={cn(
            'w-full rounded-2xl px-5 py-3.5 outline-none transition-all duration-300',
            // Clay inset surface
            'bg-[#EAEBEE] dark:bg-[#18181B]',
            'shadow-[inset_0_2px_6px_rgba(160,172,201,0.4),inset_0_-1px_rgba(255,255,255,0.6)]',
            'dark:shadow-[inset_0_3px_8px_rgba(0,0,0,0.5),inset_0_-1px_rgba(255,255,255,0.04)]',
            // Border feedback
            'border-2 border-transparent',
            'focus:border-[#4F46E5]/60 dark:focus:border-[#818CF8]/60',
            'focus:shadow-[inset_0_2px_6px_rgba(160,172,201,0.2),0_0_0_3px_rgba(79,70,229,0.12)]',
            // Text
            'text-[#1E293B] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#52525B]',
            'text-sm font-medium',
            error && 'border-red-500/60 focus:border-red-500/60',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-red-500 dark:text-red-400 text-xs ml-2 font-medium">{error}</span>
        )}
      </div>
    );
  }
);
ClayInput.displayName = 'ClayInput';

export interface ClayTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const ClayTextarea = forwardRef<HTMLTextAreaElement, ClayTextareaProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-[#1E293B] dark:text-[#FAFAFA] ml-1">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'w-full rounded-2xl px-5 py-4 outline-none transition-all duration-300 resize-y min-h-[120px]',
            'bg-[#EAEBEE] dark:bg-[#18181B]',
            'shadow-[inset_0_2px_6px_rgba(160,172,201,0.4),inset_0_-1px_rgba(255,255,255,0.6)]',
            'dark:shadow-[inset_0_3px_8px_rgba(0,0,0,0.5),inset_0_-1px_rgba(255,255,255,0.04)]',
            'border-2 border-transparent',
            'focus:border-[#4F46E5]/60 dark:focus:border-[#818CF8]/60',
            'focus:shadow-[inset_0_2px_6px_rgba(160,172,201,0.2),0_0_0_3px_rgba(79,70,229,0.12)]',
            'text-[#1E293B] dark:text-[#FAFAFA] placeholder-[#94A3B8] dark:placeholder-[#52525B]',
            'text-sm font-medium',
            error && 'border-red-500/60',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-red-500 dark:text-red-400 text-xs ml-2 font-medium">{error}</span>
        )}
      </div>
    );
  }
);
ClayTextarea.displayName = 'ClayTextarea';
