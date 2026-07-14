// src/components/ui/AlumniCard.tsx
import Image from 'next/image';
import { ClayCard } from './ClayCard';
import { Quote } from 'lucide-react';

interface AlumniCardProps {
  name: string;
  company: string;
  comment: string;
  photoUrl?: string;
  className?: string;
}

import { cn } from '@/lib/utils';

export const AlumniCard = ({ name, company, comment, photoUrl, className }: AlumniCardProps) => {
  return (
    <ClayCard tilt className={cn("w-full h-full flex flex-col p-6 min-h-[200px] relative overflow-hidden", className)} noEntrance>
      {/* Decorative quote mark */}
      <Quote className="absolute top-4 right-4 w-10 h-10 text-[#4F46E5]/10 dark:text-[#818CF8]/10 rotate-180" />

      <p className="text-[#334155] dark:text-[#A1A1AA] italic mb-6 relative z-10 flex-grow text-sm leading-relaxed">
        "{comment}"
      </p>

      <div className="flex items-center gap-3 mt-auto relative z-10 border-t border-[#E2E4EC] dark:border-[#3F3F46] pt-4">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={name}
            width={42}
            height={42}
            className="rounded-full object-cover ring-2 ring-[#4F46E5]/20 dark:ring-[#818CF8]/20"
            unoptimized={photoUrl.includes('ibb.co')}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <h4 className="font-bold text-sm text-[#1E293B] dark:text-[#FAFAFA]">{name}</h4>
          <p className="text-xs text-[#4F46E5] dark:text-[#818CF8] font-semibold">{company}</p>
        </div>
      </div>
    </ClayCard>
  );
};
