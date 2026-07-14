'use client'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import { BendyButton } from '@/components/ui/BendyButton';
import { ClayCard } from '@/components/ui/ClayCard';
import { DashboardSkeleton } from '@/components/ui/SkeletonLoader';
import {
  Activity, Mail, Sparkles, UserCheck, Code, Newspaper,
  Users, Calendar, BookOpen, Rss, ArrowRight, Settings, Info,
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// ─── Stagger container ──────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

// ─── Dashboard card data ─────────────────────────────────────────
const DASH_CARDS = [
  { title: 'From HoD', desc: 'Department updates directly from the Head of Department.', icon: Activity, color: '#EC4899', bg: 'bg-pink-50 dark:bg-pink-900/20', href: ROUTES.hod },
  { title: 'Students Corner', desc: 'Showcase achievements, projects, and research work.', icon: UserCheck, color: '#14B8A6', bg: 'bg-teal-50 dark:bg-teal-900/20', href: ROUTES.studentsCorner },
  { title: 'Weekly Coding', desc: 'HackerRank challenges, leaderboard and coding resources.', icon: Code, color: '#4F46E5', bg: 'bg-indigo-50 dark:bg-indigo-900/20', href: ROUTES.weeklyCoding },
  { title: 'Trending News', desc: 'Latest news, announcements and department updates.', icon: Newspaper, color: '#F97316', bg: 'bg-orange-50 dark:bg-orange-900/20', href: ROUTES.news },
  { title: 'Alumni', desc: 'Hear inspiring stories from our successful alumni network.', icon: Users, color: '#A855F7', bg: 'bg-purple-50 dark:bg-purple-900/20', href: ROUTES.alumni },
  { title: 'Events', desc: 'Upcoming department seminars, hackathons and college events.', icon: Calendar, color: '#EF4444', bg: 'bg-red-50 dark:bg-red-900/20', href: ROUTES.events },
  { title: 'Resources', desc: 'Curated AI tools, free courses, and helpful links.', icon: BookOpen, color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/20', href: ROUTES.resources },
  { title: 'About', desc: 'Meet the developer and the team behind this platform.', icon: Info, color: '#6B7280', bg: 'bg-gray-100 dark:bg-gray-800/50', href: '#' },
];

// ─── Parallax blobs (background) ────────────────────────────────
const ParallaxBlob = ({ className, delay = 0 }: { className: string; delay?: number }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, delay * 40]);
  return (
    <motion.div ref={ref} style={{ y }} className={cn('absolute rounded-full blur-[120px] -z-10 pointer-events-none', className)} />
  );
};

export default function Home() {
  const { user, loading, error, signIn } = useAuth();

  const visibleCards = user?.role === 'superadmin' 
    ? [...DASH_CARDS, { title: 'Manage Users', desc: 'Assign roles and manage user access.', icon: Settings, color: '#334155', bg: 'bg-slate-100 dark:bg-slate-800', href: ROUTES.manageUsers }] 
    : DASH_CARDS;

  let displayFirstName = user?.displayName?.split(' ')[0] || '';
  if (user?.email && user.email.startsWith('cse') && user.email.endsWith('@saranathan.ac.in')) {
    const parts = user.displayName?.split(' ') || [];
    if (parts.length > 1) {
      displayFirstName = parts[1];
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#EAEBEE] dark:bg-[#18181B]">
      {/* ── Parallax background blobs ─── */}
      <ParallaxBlob className="top-[-8%] left-[-6%] w-[45%] h-[45%] bg-[#4F46E5]/12 animate-blob" delay={1} />
      <ParallaxBlob className="top-[35%] right-[-8%] w-[35%] h-[55%] bg-pink-500/10 animate-blob" delay={-1} style={{ animationDelay: '2s' } as any} />
      <ParallaxBlob className="bottom-[-15%] left-[18%] w-[50%] h-[40%] bg-teal-400/10 animate-blob" delay={0.5} style={{ animationDelay: '4s' } as any} />

      <main className="pt-24 pb-24 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── Loading skeleton ─────────────────────────────── */}
          {loading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DashboardSkeleton />
            </motion.div>
          )}

          {/* ── Logged-in dashboard ──────────────────────────── */}
          {!loading && user && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Hero greeting */}
              <div className="text-center mb-14 space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-bold bg-[#4F46E5]/10 dark:bg-[#818CF8]/10 text-[#4F46E5] dark:text-[#818CF8]"
                >
                  <Sparkles className="w-4 h-4" />
                  Welcome back, {displayFirstName}!
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
                  className="font-black text-4xl sm:text-6xl md:text-7xl leading-tight select-none"
                  style={{
                    // Nunito Black — soft, rounded, clay-matching
                    letterSpacing: '-0.02em',
                    // 3D clay text shadow on the CSE part
                    textShadow: [
                      '0 1px 0 #c7d2fe',
                      '0 2px 0 #a5b4fc',
                      '0 3px 0 #818cf8',
                      '0 4px 0 #6366f1',
                      '0 6px 16px rgba(79,70,229,0.3)',
                    ].join(', '),
                    color: '#4F46E5',
                  }}
                >
                  SARA CSE{' — '}
                  <span
                    className="text-[#1E293B] dark:text-[#FAFAFA]"
                    style={{
                      textShadow: [
                        '0 1px 0 #cbd5e1',
                        '0 2px 0 #94a3b8',
                        '0 3px 0 #64748b',
                        '0 4px 12px rgba(30,41,59,0.18)',
                      ].join(', '),
                    }}
                  >
                    STUCOR
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-[#64748B] dark:text-[#A1A1AA] text-lg max-w-2xl mx-auto leading-relaxed"
                >
                  Welcome to the digital heart of our CSE Department. Stay Updated, Showcase Skills, and Engage with the Community.
                </motion.p>
              </div>

              {/* Dashboard cards with stagger */}
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {visibleCards.map((card) => (
                  <motion.div key={card.title} variants={cardItem}>
                    <Link href={card.href} className="block h-full group">
                      <ClayCard
                        tilt
                        noEntrance
                        className={cn(
                          'h-full flex flex-col gap-4 cursor-pointer',
                          'hover:shadow-[0_16px_48px_rgba(160,172,201,0.6),inset_0_1px_1px_rgba(255,255,255,0.9)]',
                          'dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.7),inset_0_1px_rgba(255,255,255,0.07)]',
                          'transition-shadow duration-300'
                        )}
                      >
                        {/* Icon badge */}
                        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner', card.bg)}>
                          <card.icon className="w-6 h-6" style={{ color: card.color }} />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-[#1E293B] dark:text-[#FAFAFA] mb-1 leading-tight">
                            {card.title}
                          </h3>
                          <p className="text-sm text-[#64748B] dark:text-[#A1A1AA] leading-snug">
                            {card.desc}
                          </p>
                        </div>

                        <div className="flex items-center text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] gap-1 group-hover:gap-2 transition-all duration-200">
                          Explore <ArrowRight className="w-3 h-3" />
                        </div>
                      </ClayCard>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ── Pre-login / Access denied view ──────────────── */}
          {!loading && !user && (
            <motion.div
              key="pre-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col md:flex-row items-center gap-12 mt-8 max-w-6xl mx-auto"
            >
              {/* Left: Text + CTA */}
              <div className="w-full md:w-1/2 space-y-7">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4F46E5]/10 dark:bg-[#818CF8]/10 text-[#4F46E5] dark:text-[#818CF8] text-sm font-bold">
                    <Sparkles className="w-4 h-4" /> Student Community Portal
                  </span>

                  <h1
                    className="font-black text-5xl sm:text-6xl md:text-7xl leading-[1.05] select-none"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    <span className="text-[#1E293B] dark:text-[#FAFAFA]">Welcome to</span>{' '}
                    <span
                      style={{
                        display: 'block',
                        color: '#4F46E5',
                        textShadow: [
                          '0 1px 0 #c7d2fe',
                          '0 2px 0 #a5b4fc',
                          '0 3px 0 #818cf8',
                          '0 4px 0 #6366f1',
                          '0 5px 0 #4f46e5',
                          '0 7px 18px rgba(79,70,229,0.35)',
                        ].join(', '),
                      }}
                    >
                      CSE Digital Heart.
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-[#64748B] dark:text-[#A1A1AA] leading-relaxed"
                >
                  Only recognized Saranathan College{' '}
                  <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">CSE students</span>{' '}
                  and staff are authorized. Log in securely with your college Google account.
                </motion.p>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        'flex items-start gap-4 p-5 rounded-[22px]',
                        'bg-red-50 dark:bg-red-900/20 border-2 border-red-200/60 dark:border-red-800/30',
                        'text-red-800 dark:text-red-300'
                      )}
                    >
                      <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm mb-0.5">Access Restricted</p>
                        <p className="text-sm leading-snug">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <BendyButton
                    onClick={signIn}
                    className="text-base py-4 px-8 w-full sm:w-auto flex items-center justify-center gap-3"
                  >
                    {/* Google Logo SVG */}
                    <svg className="w-5 h-5 bg-white rounded-full p-0.5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </BendyButton>
                </motion.div>
              </div>

              {/* Right: Floating hero card */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
                className="w-full md:w-1/2 flex justify-center relative"
              >
                {/* Glowing halo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4F46E5]/20 via-[#7C3AED]/15 to-teal-400/15 rounded-full blur-[90px] -z-10" />

                <ClayCard tilt className="p-8 w-full max-w-[280px] sm:max-w-sm aspect-square flex items-center justify-center relative overflow-hidden !rounded-full">
                  {/* Shimmering inner layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/[0.04] to-transparent pointer-events-none" />

                  <div className="text-center relative z-10 flex items-center justify-center w-full h-full">
                    <motion.div
                      animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                      className="w-[85%] h-[85%] flex items-center justify-center"
                    >
                      <img 
                        src="/icons/LOGO.png" 
                        alt="SARA CSE Logo" 
                        className="w-full h-full object-contain drop-shadow-md"
                      />
                    </motion.div>
                  </div>
                </ClayCard>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}