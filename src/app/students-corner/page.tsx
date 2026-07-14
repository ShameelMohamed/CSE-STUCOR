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
import { FORMS } from '@/lib/constants';
import { ExternalLink, Trophy, Code, BookOpen, Trash2, Loader2, ImagePlus } from 'lucide-react';
import Image from 'next/image';

type EntryType = 'achievement' | 'project' | 'research';

export default function StudentsCornerPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'stucor';
  
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [type, setType] = useState<EntryType>('achievement');
  const [studentName, setStudentName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'achievements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(data);
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
    if (!studentName || !title || !description) return;

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success || data.url) imageUrl = data.url;
      }

      await addDoc(collection(db, 'achievements'), {
        type, studentName, academicYear, title, description, imageUrl,
        createdAt: serverTimestamp(),
        addedBy: user?.uid
      });

      // Reset
      setStudentName(''); setAcademicYear(''); setTitle(''); setDescription('');
      setImageFile(null); setImagePreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this entry?')) {
      await deleteDoc(doc(db, 'achievements', id));
    }
  };

  const renderSection = (sectionType: EntryType, titleText: string, icon: any) => {
    const sectionEntries = entries.filter(e => e.type === sectionType);
    const Icon = icon;

    return (
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
          <div className="p-2 bg-department/10 text-department rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{titleText}</h2>
        </div>

        {sectionEntries.length === 0 ? (
          <EmptyState message={`No ${titleText.toLowerCase()} yet`} className="py-8" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionEntries.map(entry => (
              <ClayCard key={entry.id} className="flex flex-col h-full overflow-hidden p-0">
                {entry.imageUrl && (
                  <div className="w-full h-48 relative bg-gray-100">
                    <Image src={entry.imageUrl} alt={entry.title} fill className="object-cover" unoptimized={entry.imageUrl.includes('ibb.co')} />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 leading-tight">{entry.title}</h3>
                    {isAdmin && (
                      <button onClick={() => handleDelete(entry.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-department font-medium text-sm mb-4">
                    By {entry.studentName} {entry.academicYear ? `(${entry.academicYear})` : ''}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{entry.description}</p>
                </div>
              </ClayCard>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-32" />;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Students Corner</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Celebrating our students' achievements and work.</p>
        </div>
        <a href={FORMS.achievements} target="_blank" rel="noopener noreferrer">
          <BendyButton className="flex items-center gap-2 bg-teal-500">
            Submit Your Work <ExternalLink className="w-4 h-4" />
          </BendyButton>
        </a>
      </div>

      {isAdmin && (
        <ClayCard className="mb-12 p-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
          <h3 className="font-bold text-lg mb-4 text-blue-900 dark:text-blue-300">Admin: Add New Entry</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as EntryType)}
                className="bg-white dark:bg-[#1f2836] rounded-2xl px-5 py-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-none outline-none focus:border-department border-2 border-transparent"
              >
                <option value="achievement">Achievement</option>
                <option value="project">Project</option>
                <option value="research">Research Publication</option>
              </select>
              <ClayInput placeholder="Student Name(s)" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />
              <ClayInput placeholder="Academic Year (e.g., 2024-2028)" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} required />
            </div>
            <ClayInput placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <ClayTextarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            
            <div className="flex items-center justify-between">
              <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-department">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <ImagePlus className="w-5 h-5" />
                {imageFile ? <span className="text-sm truncate max-w-[150px]">{imageFile.name}</span> : <span className="text-sm">Optional Image</span>}
              </label>
              <BendyButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Entry'}
              </BendyButton>
            </div>
          </form>
        </ClayCard>
      )}

      {renderSection('achievement', 'Achievements', Trophy)}
      {renderSection('project', 'Outstanding Projects', Code)}
      {renderSection('research', 'Research & Publications', BookOpen)}
    </div>
  );
}
