// src/components/ui/PostCard.tsx
'use client'
import Image from 'next/image';
import { ClayCard } from './ClayCard';
import { LikeButton } from './LikeButton';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostCardProps {
  id: string;
  collectionName: string;
  authorName?: string;
  authorPhoto?: string;
  content?: string;
  imageUrl?: string;
  createdAt: any;
  likes?: { uid: string; displayName: string }[];
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

export const PostCard = ({
  id,
  collectionName,
  authorName,
  authorPhoto,
  content,
  imageUrl,
  createdAt,
  likes = [],
  onDelete,
  canDelete = false,
}: PostCardProps) => {
  const formattedDate = createdAt?.toDate
    ? new Intl.DateTimeFormat('en-IN', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',
      }).format(createdAt.toDate())
    : 'Just now';

  return (
    <ClayCard className="w-full relative overflow-hidden flex flex-col gap-5" noEntrance>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {authorPhoto ? (
            <Image
              src={authorPhoto}
              alt={authorName || 'Author'}
              width={44}
              height={44}
              className="rounded-full object-cover ring-2 ring-[#4F46E5]/20 dark:ring-[#818CF8]/20"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-bold text-base shadow-md">
              {authorName?.charAt(0) || 'A'}
            </div>
          )}
          <div>
            <h4 className="font-bold text-[#1E293B] dark:text-[#FAFAFA] leading-tight text-sm">
              {authorName || 'Department Post'}
            </h4>
            <p className="text-xs text-[#94A3B8] dark:text-[#71717A] mt-0.5">{formattedDate}</p>
          </div>
        </div>

        {canDelete && onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(id)}
            className="p-2 text-[#94A3B8] hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Delete post"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Content */}
      {content && (
        <p className="text-[#1E293B] dark:text-[#D4D4D8] whitespace-pre-wrap leading-relaxed text-sm">
          {content}
        </p>
      )}

      {/* Image Attachment */}
      {imageUrl && (
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden">
          <Image
            src={imageUrl}
            alt="Post attachment"
            fill
            className="object-cover"
            unoptimized={imageUrl.includes('ibb.co')}
          />
        </div>
      )}

      {/* Footer / Actions */}
      <div className="pt-3 border-t border-[#E2E4EC] dark:border-[#3F3F46] mt-1">
        <LikeButton collectionName={collectionName} documentId={id} initialLikes={likes} />
      </div>
    </ClayCard>
  );
};
