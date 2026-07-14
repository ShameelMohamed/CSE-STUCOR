'use client'
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayInput, ClayTextarea } from '@/components/ui/ClayInput';
import { BendyButton } from '@/components/ui/BendyButton';
import { AlumniCard } from '@/components/ui/AlumniCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Users, Loader2, ImagePlus, Trash2 } from 'lucide-react';

export default function AlumniPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'alumni'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlumni(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !comment) return;

    setIsSubmitting(true);
    try {
      let photoUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success || data.url) photoUrl = data.url;
      }

      await addDoc(collection(db, 'alumni'), {
        name, company, comment, photoUrl,
        createdAt: serverTimestamp(),
      });
      
      setName(''); setCompany(''); setComment(''); setImageFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this alumni record?')) {
      await deleteDoc(doc(db, 'alumni', id));
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-32" />;

  const moveToEnd = () => {
    setAlumni((prev) => {
      const newCards = [...prev];
      const topCard = newCards.shift();
      if (topCard) newCards.push(topCard);
      return newCards;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (wheelTimeout.current) return;
    
    // Check if the scroll is significant enough (prevent tiny trackpad jitters)
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
      moveToEnd();
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 400); // 400ms throttle
    }
  };

  return (
    <div className="pt-32 pb-20 px-0 md:px-6 max-w-[100vw] overflow-x-hidden">
      <div className="mb-12 flex flex-col items-center text-center px-6">
        <div className="p-4 bg-purple-500/10 text-purple-500 rounded-full mb-4">
          <Users className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Our Alumni Network</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl text-lg">Hear from our successful graduates working across the tech industry.</p>
        <p className="text-department font-bold mt-4 bg-department/10 px-6 py-3 rounded-full inline-block text-base">
          New alumni insights added every week! Swipe left or right to read from our alumni.
        </p>
      </div>

      {isAdmin && (
        <div className="max-w-3xl mx-auto px-6 mb-16">
          <ClayCard className="p-6 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
            <h3 className="font-bold text-lg mb-4 text-purple-900 dark:text-purple-300">Admin: Add Alumni</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ClayInput placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <ClayInput placeholder="Company / Role" value={company} onChange={(e) => setCompany(e.target.value)} required />
              </div>
              <ClayTextarea placeholder="Short Quote/Comment" value={comment} onChange={(e) => setComment(e.target.value)} required />
              
              <div className="flex items-center justify-between">
                <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-department">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  <ImagePlus className="w-5 h-5" />
                  {imageFile ? <span className="text-sm">{imageFile.name}</span> : <span className="text-sm">Upload Photo</span>}
                </label>
                <BendyButton type="submit" disabled={isSubmitting} className="bg-purple-600">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Alumni'}
                </BendyButton>
              </div>
            </form>
          </ClayCard>
          
          {/* Admin list view for deleting */}
          {alumni.length > 0 && (
            <div className="mt-8 space-y-2">
              <h4 className="font-bold text-gray-500 text-sm uppercase">Manage Alumni</h4>
              {alumni.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{a.name}</span>
                    <span className="text-xs text-gray-500">{a.company}</span>
                  </div>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {alumni.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No alumni records found.</div>
      ) : (
        <div 
          className="relative w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto h-[400px] flex items-center justify-center mt-16 mb-20"
          onWheel={handleWheel}
        >
          <AnimatePresence>
            {alumni.map((card, index) => {
              const isTop = index === 0;
              return (
                <motion.div
                  key={card.id}
                  className="absolute w-full h-[320px]"
                  style={{ zIndex: alumni.length - index }}
                  initial={{ scale: 0.8, opacity: 0, y: -50, x: 50 }}
                  animate={{
                    scale: 1 - index * 0.05,
                    opacity: 1 - index * 0.15,
                    x: index === 0 ? 20 : index * -8,
                    y: index === 0 ? -20 : index * 8,
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                      moveToEnd();
                    }
                  }}
                >
                  <div className="w-full h-full cursor-grab active:cursor-grabbing pointer-events-auto">
                    <AlumniCard
                      name={card.name}
                      company={card.company}
                      comment={card.comment}
                      photoUrl={card.photoUrl}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
