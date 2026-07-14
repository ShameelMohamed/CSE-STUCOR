'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayInput } from '@/components/ui/ClayInput';
import { BendyButton } from '@/components/ui/BendyButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LikeButton } from '@/components/ui/LikeButton';
import { Calendar, Trash2, Loader2, ImagePlus, Upload } from 'lucide-react';
import Image from 'next/image';

export default function EventsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'event';
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageFile) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      await addDoc(collection(db, 'events'), {
        title,
        posterUrl: data.url,
        createdAt: serverTimestamp(),
        likes: []
      });
      
      setTitle(''); setImageFile(null); setImagePreview(null);
    } catch (err) {
      console.error(err);
      alert('Failed to upload event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this event?')) {
      await deleteDoc(doc(db, 'events', id));
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-32" />;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Events</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Upcoming and past department events.</p>
        </div>
        <Calendar className="w-12 h-12 text-department hidden md:block" />
      </div>

      {isAdmin && (
        <ClayCard className="mb-12 p-6 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
          <h3 className="font-bold text-lg mb-4 text-red-900 dark:text-red-300">Admin: Add Event Poster</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ClayInput placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            {imagePreview ? (
              <div className="relative w-full max-w-sm h-64 rounded-xl overflow-hidden mx-auto">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500">X</button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <label className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600 font-medium">Click to upload poster image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} required />
                </label>
              </div>
            )}

            <div className="flex justify-end mt-2">
              <BendyButton type="submit" disabled={isSubmitting || !imageFile} className="bg-red-500 flex items-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ImagePlus className="w-4 h-4" /> Publish Event</>}
              </BendyButton>
            </div>
          </form>
        </ClayCard>
      )}

      {events.length === 0 ? (
        <EmptyState message="No events scheduled" icon="ghost" className="py-12" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <ClayCard key={event.id} className="p-0 overflow-hidden flex flex-col group hover:scale-[1.02] transition-transform">
              <div className="w-full aspect-[4/5] relative bg-gray-100 dark:bg-gray-800">
                <Image src={event.posterUrl} alt={event.title} fill className="object-cover" unoptimized={event.posterUrl.includes('ibb.co')} />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight pr-4">{event.title}</h3>
                  {isAdmin && (
                    <button onClick={() => handleDelete(event.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                   <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                     {event.createdAt?.toDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(event.createdAt.toDate()) : ''}
                   </p>
                   <LikeButton collectionName="events" documentId={event.id} initialLikes={event.likes} />
                </div>
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
