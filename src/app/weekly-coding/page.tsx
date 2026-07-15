'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { ClayCard } from '@/components/ui/ClayCard';
import { ClayInput } from '@/components/ui/ClayInput';
import { BendyButton } from '@/components/ui/BendyButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Trophy, ExternalLink, Save, Plus, Trash2 } from 'lucide-react';

export default function WeeklyCodingPage() {
  const { user } = useAuth();
  const isCodingAdmin = user?.role === 'coding' || user?.role === 'superadmin';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data State
  const [weekLabel, setWeekLabel] = useState('Week 1');
  const [hackerRankLink, setHackerRankLink] = useState('https://hackerrank.com/');
  const [leaderboard, setLeaderboard] = useState<{rank: number, name: string, score: number, solvedCount: number}[]>([]);

  useEffect(() => {
    // We'll store it in a single document for simplicity: coding/current
    const docRef = doc(db, 'coding', 'current');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setWeekLabel(data.weekLabel || 'Week 1');
        setHackerRankLink(data.hackerRankLink || 'https://hackerrank.com/');
        setLeaderboard(data.leaderboard || []);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!isCodingAdmin) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'coding', 'current'), {
        weekLabel,
        hackerRankLink,
        leaderboard,
        updatedAt: serverTimestamp()
      });
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const addLeaderboardRow = () => {
    setLeaderboard([...leaderboard, { rank: leaderboard.length + 1, name: '', score: 0, solvedCount: 0 }]);
  };

  const removeRow = (index: number) => {
    const newBoard = [...leaderboard];
    newBoard.splice(index, 1);
    // Re-calculate ranks
    newBoard.forEach((item, i) => item.rank = i + 1);
    setLeaderboard(newBoard);
  };

  const updateRow = (index: number, field: string, value: any) => {
    const newBoard = [...leaderboard];
    newBoard[index] = { ...newBoard[index], [field]: value };
    setLeaderboard(newBoard);
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-32" />;

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight">Weekly Coding</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sharpen your logic and compete on HackerRank.</p>
      </div>

      <ClayCard className="mb-10 bg-gradient-to-br from-department/10 to-transparent border-department/20 border text-center p-8">
        {isCodingAdmin ? (
          <div className="max-w-md mx-auto space-y-4">
             <ClayInput placeholder="Week Label" value={weekLabel} onChange={(e) => setWeekLabel(e.target.value)} />
             <ClayInput placeholder="HackerRank Contest Link" value={hackerRankLink} onChange={(e) => setHackerRankLink(e.target.value)} />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-department mb-2">{weekLabel} Contest</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Join this week's contest and climb the leaderboard!</p>
            <a href={hackerRankLink} target="_blank" rel="noopener noreferrer">
              <BendyButton className="px-8 py-3 text-lg flex items-center gap-2 mx-auto">
                Go to HackerRank <ExternalLink className="w-5 h-5" />
              </BendyButton>
            </a>
          </>
        )}
      </ClayCard>

      <ClayCard className="p-0 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h2>
          </div>
          {isCodingAdmin && (
            <BendyButton onClick={handleSave} disabled={saving} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
              <Save className="w-4 h-4 flex-shrink-0" /> {saving ? 'Saving...' : 'Save All Changes'}
            </BendyButton>
          )}
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 font-bold border-b-2 border-gray-100 dark:border-gray-800">
                <th className="pb-3 px-4">Rank</th>
                <th className="pb-3 px-4">Student Name</th>
                <th className="pb-3 px-4">Score</th>
                <th className="pb-3 px-4">Solved</th>
                {isCodingAdmin && <th className="pb-3 px-4">Action</th>}
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">No leaderboard data yet.</td>
                </tr>
              ) : (
                leaderboard.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-gray-100">
                      #{row.rank}
                      {row.rank === 1 && <Trophy className="w-4 h-4 text-yellow-500 inline ml-2" />}
                      {row.rank === 2 && <Trophy className="w-4 h-4 text-gray-400 inline ml-2" />}
                      {row.rank === 3 && <Trophy className="w-4 h-4 text-amber-700 inline ml-2" />}
                    </td>
                    <td className="py-2 px-4">
                      {isCodingAdmin ? (
                        <ClayInput value={row.name} onChange={(e) => updateRow(idx, 'name', e.target.value)} className="py-2" />
                      ) : (
                        <span className="font-medium">{row.name}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isCodingAdmin ? (
                        <input type="number" value={row.score} onChange={(e) => updateRow(idx, 'score', Number(e.target.value))} className="w-20 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 outline-none" />
                      ) : (
                        <span className="font-mono bg-department/10 text-department px-2 py-1 rounded">{row.score}</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {isCodingAdmin ? (
                        <input type="number" value={row.solvedCount} onChange={(e) => updateRow(idx, 'solvedCount', Number(e.target.value))} className="w-20 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 outline-none" />
                      ) : (
                        row.solvedCount
                      )}
                    </td>
                    {isCodingAdmin && (
                      <td className="py-2 px-4">
                        <button onClick={() => removeRow(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {isCodingAdmin && (
            <button onClick={addLeaderboardRow} className="mt-4 flex items-center gap-2 text-department font-bold hover:underline">
              <Plus className="w-4 h-4" /> Add Row
            </button>
          )}
        </div>
      </ClayCard>
    </div>
  );
}
