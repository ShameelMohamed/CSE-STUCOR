'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayInput, ClayTextarea } from '@/components/ui/ClayInput';
import { BendyButton } from '@/components/ui/BendyButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Newspaper, Trash2, Loader2, ArrowRight } from 'lucide-react';

export default function NewsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !content) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'news'), {
        headline,
        content,
        redirectUrl,
        authorName: user?.displayName || 'Admin',
        createdAt: serverTimestamp(),
      });
      setHeadline(''); setContent(''); setRedirectUrl('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this news?')) {
      await deleteDoc(doc(db, 'news', id));
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-32" />;

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12 flex items-center gap-4">
        <div className="p-3 bg-orange-500/10 text-orange-500 rounded-2xl">
          <Newspaper className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Trending News</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Latest updates and announcements.</p>
        </div>
      </div>

      {isAdmin && (
        <ClayCard className="mb-12 p-6 bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
          <h3 className="font-bold text-lg mb-4 text-orange-900 dark:text-orange-300">Admin: Post News</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ClayInput placeholder="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} required />
            <ClayTextarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
            <ClayInput placeholder="Source Link (optional) e.g., https://example.com" value={redirectUrl} onChange={(e) => setRedirectUrl(e.target.value)} />
            <div className="flex justify-end">
              <BendyButton type="submit" disabled={isSubmitting} className="bg-orange-500">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish News'}
              </BendyButton>
            </div>
          </form>
        </ClayCard>
      )}

      {news.length === 0 ? (
        <EmptyState message="No news currently" className="py-12" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map(item => (
            <ClayCard key={item.id} className="flex flex-col h-full relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-orange-400" />
              <div className="pl-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-tight pr-8">{item.headline}</h3>
                  {isAdmin && (
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 absolute top-6 right-6">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mb-4">
                  {item.createdAt?.toDate ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(item.createdAt.toDate()) : 'Just now'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap flex-grow">{item.content}</p>
                {item.redirectUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <a 
                      href={item.redirectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Read Source <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </div>
  );
}
