'use client'
import { useState, useEffect } from 'react';
import { Sun, Moon, Rss, LogOut, Menu, X, User as UserIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { BendyButton } from './ui/BendyButton';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { ROUTES } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'From HoD',       path: ROUTES.hod },
  { name: 'Students Corner', path: ROUTES.studentsCorner },
  { name: 'Weekly Coding',  path: ROUTES.weeklyCoding },
  { name: 'Trending News',  path: ROUTES.news },
  { name: 'Alumni',         path: ROUTES.alumni },
  { name: 'Events',         path: ROUTES.events },
  { name: 'Resources',      path: ROUTES.resources },
];

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn, logOut } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Init theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const getDisplayName = () => {
    if (!user?.displayName) return '';
    const parts = user.displayName.split(' ');
    if (user.role === 'student' && parts.length > 1) {
      return parts[1];
    }
    return parts[0];
  };

  const getAvatarLetter = () => {
    const name = getDisplayName();
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const getAvatarColor = () => {
    const name = getDisplayName();
    if (!name) return 'from-[#4F46E5] to-[#7C3AED]';
    const colors = [
      'from-[#4F46E5] to-[#7C3AED]',
      'from-[#EC4899] to-[#E11D48]',
      'from-[#14B8A6] to-[#0D9488]',
      'from-[#F59E0B] to-[#D97706]',
      'from-[#10B981] to-[#059669]',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <>
      {/* ── Header bar ─────────────────────────────────────────── */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100]',
          'bg-[#EAEBEE]/85 dark:bg-[#18181B]/85 backdrop-blur-xl',
          'border-b border-white/70 dark:border-white/[0.07]',
          'shadow-[0_2px_16px_rgba(160,172,201,0.22)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.45)]',
          'px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4',
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <motion.div
            whileHover={{ rotate: [0, -12, 12, 0] }}
            transition={{ duration: 0.45 }}
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.4),inset_0_1px_rgba(255,255,255,0.3)]"
          >
            <Rss className="w-4 h-4 text-white" />
          </motion.div>
          {/* Prevent wrapping on mobile */}
          <span className="font-extrabold text-lg tracking-tight text-[#1E293B] dark:text-[#FAFAFA] whitespace-nowrap">
            STUCOR <span className="text-[#4F46E5] dark:text-[#818CF8] font-semibold text-sm">CSE</span>
          </span>
        </Link>

        {/* Desktop Nav — text only, no icons */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
          {/* Back button on inner pages */}
          {user && !isHome && (
            <Link
              href="/"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold mr-3 transition-all duration-200',
                'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#818CF8]',
                'bg-[#F3F4F7] dark:bg-[#27272A]',
                'shadow-[0_2px_8px_rgba(160,172,201,0.25),inset_0_1px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.05)]',
                'border-r-2 border-[#E2E4EC] dark:border-[#3F3F46] pr-4 mr-4'
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
          )}

          {user && NAV_LINKS.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  'relative px-3 py-1.5 rounded-xl transition-all duration-200 text-sm font-bold whitespace-nowrap',
                  isActive
                    ? 'text-[#4F46E5] dark:text-[#818CF8]'
                    : 'text-[#64748B] dark:text-[#A1A1AA] hover:text-[#4F46E5] dark:hover:text-[#818CF8]',
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-[#4F46E5]/10 dark:bg-[#818CF8]/10 -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Controls */}
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className={cn(
              'p-2.5 rounded-xl transition-colors',
              'bg-[#F3F4F7] dark:bg-[#27272A]',
              'shadow-[0_2px_8px_rgba(160,172,201,0.3),inset_0_1px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_rgba(255,255,255,0.05)]',
              'text-[#64748B] dark:text-[#A1A1AA]',
            )}
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          {user ? (
            <div className="flex items-center gap-3 pl-3 ml-1 border-l border-[#E2E4EC] dark:border-[#3F3F46]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#4F46E5]/20 dark:ring-[#818CF8]/20 flex-shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", getAvatarColor())}>
                      {getAvatarLetter() || <UserIcon className="w-4 h-4" />}
                    </div>
                  )}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold text-[#1E293B] dark:text-[#FAFAFA]">{getDisplayName()}</span>
                  <span className="text-[10px] text-[#4F46E5] dark:text-[#818CF8] font-bold uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                onClick={logOut}
                className="p-2 text-[#94A3B8] hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <BendyButton onClick={signIn} className="py-2 px-5 text-sm">
              Login
            </BendyButton>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-1 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl text-[#64748B] dark:text-[#A1A1AA]"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          {/* Hamburger — always clearly visible */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'p-2 rounded-xl transition-colors font-bold',
              isMobileMenuOpen
                ? 'bg-[#4F46E5] text-white shadow-[0_4px_12px_rgba(79,70,229,0.4)]'
                : 'bg-[#F3F4F7] dark:bg-[#27272A] text-[#1E293B] dark:text-[#FAFAFA]',
              'shadow-[0_2px_8px_rgba(160,172,201,0.25),inset_0_1px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.05)]'
            )}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* ── Mobile Menu ─────────────────────────────────────────────
           Rendered as a sibling to <header>, NOT inside it.
           This prevents z-index clipping and partial visibility. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              'fixed left-0 right-0 bottom-0 z-[90]', // sits below header z-[100]
              'top-16',                                 // exactly below the 64px header
              'bg-[#EAEBEE]/98 dark:bg-[#18181B]/98 backdrop-blur-2xl',
              'flex flex-col p-5 overflow-y-auto lg:hidden',
            )}
          >
            {/* User profile strip */}
            {user && (
              <div className={cn(
                'flex items-center gap-4 p-4 mb-5 rounded-[22px]',
                'bg-[#F3F4F7] dark:bg-[#27272A]',
                'shadow-[0_4px_16px_rgba(160,172,201,0.3),inset_0_1px_rgba(255,255,255,0.9)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_rgba(255,255,255,0.05)]'
              )}>
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#4F46E5]/20 dark:ring-[#818CF8]/20 flex-shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl", getAvatarColor())}>
                      {getAvatarLetter() || <UserIcon />}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#1E293B] dark:text-[#FAFAFA]">{user.role === 'student' ? user.displayName?.split(' ').slice(1).join(' ') || user.displayName : user.displayName}</h3>
                  <p className="text-sm text-[#64748B] dark:text-[#71717A]">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-[#4F46E5]/10 dark:bg-[#818CF8]/10 text-[#4F46E5] dark:text-[#818CF8] rounded-full text-xs font-bold uppercase tracking-wide">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            {/* Nav links — text only */}
            <div className="flex flex-col gap-2 flex-1">
              {(user ? NAV_LINKS : []).map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.035, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center p-4 rounded-[18px] font-bold text-base transition-all duration-200',
                      pathname === link.path
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-[0_6px_20px_rgba(79,70,229,0.35)]'
                        : cn(
                          'bg-[#F3F4F7] dark:bg-[#27272A] text-[#1E293B] dark:text-[#FAFAFA]',
                          'shadow-[0_2px_8px_rgba(160,172,201,0.25),inset_0_1px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.05)]',
                          'hover:bg-[#4F46E5]/8 dark:hover:bg-[#818CF8]/8 hover:text-[#4F46E5] dark:hover:text-[#818CF8]',
                        )
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom action */}
            <div className="pt-5 pb-4">
              {user ? (
                <BendyButton
                  variant="danger"
                  onClick={() => { logOut(); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 text-base"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </BendyButton>
              ) : (
                <BendyButton
                  onClick={() => { signIn(); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 text-base"
                >
                  <Sparkles className="w-5 h-5" /> Sign In with Google
                </BendyButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}