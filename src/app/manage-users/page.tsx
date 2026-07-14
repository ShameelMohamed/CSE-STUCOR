'use client'
import { useState, useEffect } from 'react';
import { useAuth, UserRole } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayInput } from '@/components/ui/ClayInput';
import { BendyButton } from '@/components/ui/BendyButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Settings, Search, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function ManageUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pre-provision form state
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Redirect if not superadmin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'superadmin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role !== 'superadmin') return;
    const q = query(collection(db, 'userRoles'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ email: doc.id, ...doc.data() }));
      setUsersList(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleRoleChange = async (email: string, updatedRole: UserRole) => {
    try {
      await setDoc(doc(db, 'userRoles', email), { role: updatedRole }, { merge: true });
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role. Please check permissions.');
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newRole) return;
    setIsAdding(true);
    try {
      await setDoc(doc(db, 'userRoles', newEmail.toLowerCase().trim()), { role: newRole }, { merge: true });
      setNewEmail('');
    } catch (err) {
      console.error(err);
      alert('Failed to add role');
    } finally {
      setIsAdding(false);
    }
  };

  const filteredUsers = usersList.filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const roleColors: Record<UserRole, string> = {
    student: 'text-teal-500 bg-teal-500/10',
    admin: 'text-pink-500 bg-pink-500/10',
    coding: 'text-indigo-500 bg-indigo-500/10',
    hod: 'text-orange-500 bg-orange-500/10',
    superadmin: 'text-purple-500 bg-purple-500/10',
    stucor: 'text-yellow-500 bg-yellow-500/10',
    event: 'text-red-500 bg-red-500/10',
  };

  if (authLoading || (user?.role === 'superadmin' && loading)) return <LoadingSpinner size="lg" className="mt-32" />;
  if (!user || user.role !== 'superadmin') return null;

  return (
    <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="mb-12 flex items-center gap-4">
        <div className="p-3 bg-slate-500/10 text-slate-700 dark:text-slate-300 rounded-2xl">
          <Settings className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Manage Users</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Assign and edit roles for students and staff.</p>
        </div>
      </div>

      <ClayCard className="p-6 mb-12 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
        <h3 className="font-bold text-lg mb-4 text-blue-900 dark:text-blue-300">Pre-provision User Role</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Assign a role to an email address even if they haven't logged in yet.</p>
        <form onSubmit={handleAddRole} className="flex flex-col md:flex-row gap-4">
          <ClayInput 
            type="email" 
            placeholder="Email Address" 
            value={newEmail} 
            onChange={(e) => setNewEmail(e.target.value)} 
            required 
            className="flex-grow"
          />
          <select
            className="bg-white dark:bg-[#1f2836] border-2 border-transparent focus:border-department text-gray-900 dark:text-gray-100 text-sm rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-3 outline-none"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as UserRole)}
          >
            <option value="student">Student</option>
            <option value="coding">Coding</option>
            <option value="admin">Admin</option>
            <option value="hod">HOD</option>
            <option value="stucor">Stucor</option>
            <option value="event">Event</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <BendyButton type="submit" disabled={isAdding} className="bg-blue-600 flex items-center justify-center gap-2 whitespace-nowrap">
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Role</>}
          </BendyButton>
        </form>
      </ClayCard>

      <ClayCard className="p-6 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Role Assignments</h3>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search emails..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-department"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                <th className="pb-4 font-semibold px-4">Email</th>
                <th className="pb-4 font-semibold px-4">Current Role</th>
                <th className="pb-4 font-semibold px-4">Assign Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-8 text-gray-500">No users found</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.email} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                  <td className="py-4 px-4 text-gray-800 dark:text-gray-200 font-medium text-sm">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider", roleColors[u.role as UserRole] || 'text-gray-500 bg-gray-500/10')}>
                      {u.role || 'none'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                      value={u.role || 'none'}
                      onChange={(e) => handleRoleChange(u.email, e.target.value as UserRole)}
                    >
                      <option value="student">Student</option>
                      <option value="coding">Coding</option>
                      <option value="admin">Admin</option>
                      <option value="hod">HOD</option>
                      <option value="stucor">Stucor</option>
                      <option value="event">Event</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ClayCard>
    </div>
  );
}
