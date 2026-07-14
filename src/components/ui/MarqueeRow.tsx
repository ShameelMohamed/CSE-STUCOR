import { cn } from '@/lib/utils';

interface MarqueeRowProps {
  children: React.ReactNode;
  direction?: 'forward' | 'reverse';
  speed?: 'normal' | 'slow' | 'fast';
  className?: string;
  pauseOnHover?: boolean;
}

export const MarqueeRow = ({ 
  children, 
  direction = 'forward', 
  speed = 'normal',
  className,
  pauseOnHover = true
}: MarqueeRowProps) => {
  
  const animationClass = direction === 'forward' ? 'animate-marquee' : 'animate-marqueeReverse';
  
  // Create a double set of children to ensure seamless looping
  return (
    <div className={cn("w-full overflow-hidden flex relative group py-4", className)}>
      <div 
        className={cn(
          "flex min-w-full shrink-0 gap-6 px-3", 
          animationClass,
          pauseOnHover && "group-hover:pause-animation"
        )}
        style={{ animationDuration: speed === 'slow' ? '40s' : speed === 'fast' ? '15s' : '25s' }}
      >
        {children}
      </div>
      
      {/* Duplicate for seamless looping */}
      <div 
        aria-hidden="true"
        className={cn(
          "flex min-w-full shrink-0 gap-6 px-3 absolute top-4 left-full", 
          animationClass,
          pauseOnHover && "group-hover:pause-animation"
        )}
        style={{ animationDuration: speed === 'slow' ? '40s' : speed === 'fast' ? '15s' : '25s' }}
      >
        {children}
      </div>
    </div>
  );
};
