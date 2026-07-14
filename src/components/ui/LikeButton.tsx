'use client'
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';

interface LikeButtonProps {
  collectionName: string;
  documentId: string;
  initialLikes: { uid: string; displayName: string }[];
  className?: string;
}

export const LikeButton = ({ collectionName, documentId, initialLikes = [], className }: LikeButtonProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isHovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isHovered]);

  const hasLiked = user ? likes.some(like => like.uid === user.uid) : false;

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    const docRef = doc(db, collectionName, documentId);
    const userLikeObj = { uid: user.uid, displayName: user.displayName || 'Student' };

    try {
      if (hasLiked) {
        // Optimistic update
        setLikes(prev => prev.filter(like => like.uid !== user.uid));
        await updateDoc(docRef, {
          likes: arrayRemove(userLikeObj)
        });
      } else {
        // Optimistic update
        setLikes(prev => [...prev, userLikeObj]);
        await updateDoc(docRef, {
          likes: arrayUnion(userLikeObj)
        });
      }
    } catch (error) {
      console.error("Error updating like", error);
      // Revert on error
      setLikes(initialLikes);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div 
      ref={buttonRef}
      className={cn("relative flex items-center gap-2", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        disabled={!user || isLiking}
        className={cn(
          "p-2 rounded-full transition-colors flex items-center justify-center",
          hasLiked
            ? "bg-[#4F46E5]/10 text-[#4F46E5] dark:bg-[#818CF8]/15 dark:text-[#818CF8]"
            : "bg-[#F3F4F7] dark:bg-[#27272A] text-[#94A3B8] hover:bg-[#4F46E5]/10 dark:hover:bg-[#818CF8]/10 hover:text-[#4F46E5] dark:hover:text-[#818CF8]"
        )}
      >
        <ThumbsUp className={cn("w-5 h-5", hasLiked && "fill-current")} />
      </motion.button>

      <span className="font-semibold text-[#64748B] dark:text-[#A1A1AA] text-sm">
        {likes.length}
      </span>

      {/* Tooltip for showing who liked */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isHovered && likes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute',
                top: tooltipPos.top - 10,
                left: tooltipPos.left,
                transform: 'translateY(-100%)',
                zIndex: 99999,
              }}
              className="w-48 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg pointer-events-none"
            >
              <p className="font-semibold mb-1 border-b border-gray-700 pb-1">Liked by:</p>
              <div className="max-h-24 overflow-hidden">
                {likes.slice(0, 5).map((like, i) => (
                  <div key={i} className="truncate">{like.displayName}</div>
                ))}
                {likes.length > 5 && (
                  <div className="text-gray-400 italic mt-1">and {likes.length - 5} more...</div>
                )}
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
