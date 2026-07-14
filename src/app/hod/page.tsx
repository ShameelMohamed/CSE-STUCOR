'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { PostCard } from '@/components/ui/PostCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayTextarea } from '@/components/ui/ClayInput';
import { BendyButton } from '@/components/ui/BendyButton';
import { ImagePlus, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HodPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isHod = user?.role === 'hod' || user?.role === 'superadmin';

  useEffect(() => {
    const q = query(collection(db, 'hod_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching HoD posts:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) {
      setError('Please provide content or an image');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to upload image');
        imageUrl = data.url;
      }

      await addDoc(collection(db, 'hod_posts'), {
        content,
        imageUrl,
        authorName: user?.displayName || 'Head of Department',
        authorPhoto: user?.photoURL || '',
        createdAt: serverTimestamp(),
        likes: []
      });

      // Reset form
      setContent('');
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'hod_posts', id));
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-32" text="Loading posts..." />;

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">From HoD</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Department updates and announcements.</p>
      </div>

      {isHod && (
        <ClayCard className="mb-10 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Create New Post</h3>
            
            <ClayTextarea 
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
            />

            {imagePreview && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden mt-2">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                >
                  X
                </button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <div className="flex items-center justify-between mt-2">
              <label className="cursor-pointer text-gray-500 hover:text-department transition-colors flex items-center gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                <ImagePlus className="w-6 h-6" />
                <span className="text-sm font-medium">Add Photo</span>
              </label>

              <BendyButton 
                type="submit" 
                disabled={isSubmitting || (!content.trim() && !imageFile)}
                className="px-8 flex items-center gap-2"
              >
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : 'Post'}
              </BendyButton>
            </div>
          </form>
        </ClayCard>
      )}

      <div className="flex flex-col gap-8">
        {posts.length === 0 ? (
          <EmptyState message="No posts from HoD yet" subMessage="Check back later for updates." />
        ) : (
          posts.map(post => (
            <PostCard 
              key={post.id}
              id={post.id}
              collectionName="hod_posts"
              authorName={post.authorName}
              authorPhoto={post.authorPhoto}
              content={post.content}
              imageUrl={post.imageUrl}
              createdAt={post.createdAt}
              likes={post.likes}
              onDelete={handleDelete}
              canDelete={isHod}
            />
          ))
        )}
      </div>
    </div>
  );
}
