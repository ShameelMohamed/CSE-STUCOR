'use client'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BendyButton } from '@/components/ui/BendyButton';
import { ShieldX, Mail, AlertTriangle, GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Stagger config
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

export default function AccessDeniedPage() {
  const [deniedEmail, setDeniedEmail] = useState<string | null>(null);

  // Read the rejected email from sessionStorage (set by authContext before redirect)
  useEffect(() => {
    const email = sessionStorage.getItem('denied_email');
    if (email) {
      setDeniedEmail(email);
      sessionStorage.removeItem('denied_email'); // consume once
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#EAEBEE] dark:bg-[#18181B] px-4">

      {/* ── Decorative blobs ─────────────────────────────── */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-red-400/10 blur-[120px] -z-10 animate-blob" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[40%] rounded-full bg-[#4F46E5]/10 blur-[100px] -z-10 animate-blob" style={{ animationDelay: '3s' }} />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg"
      >
        {/* ── Clay card ──────────────────────────────────── */}
        <div className={cn(
          'rounded-[36px] p-8 sm:p-10 flex flex-col items-center text-center gap-6',
          'bg-[#F3F4F7] dark:bg-[#27272A]',
          'shadow-[0_12px_48px_rgba(160,172,201,0.5),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-3px_8px_rgba(160,172,201,0.2)]',
          'dark:shadow-[0_12px_48px_rgba(0,0,0,0.6),inset_0_1px_rgba(255,255,255,0.06),inset_0_-2px_6px_rgba(0,0,0,0.35)]',
        )}>

          {/* Icon */}
          <motion.div variants={item}>
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className={cn(
                'w-24 h-24 rounded-[28px] flex items-center justify-center',
                'bg-gradient-to-br from-red-400 to-rose-600',
                'shadow-[0_8px_24px_rgba(239,68,68,0.4),inset_0_1px_rgba(255,255,255,0.3)]',
              )}
            >
              <ShieldX className="w-12 h-12 text-white" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={item} className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/25 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
              <AlertTriangle className="w-3.5 h-3.5" />
              Login Restricted
            </div>

            <h1
              className="font-black text-4xl sm:text-5xl text-[#1E293B] dark:text-[#FAFAFA] leading-tight select-none"
              style={{
                letterSpacing: '-0.02em',
                textShadow: [
                  '0 1px 0 #fecaca',
                  '0 2px 0 #fca5a5',
                  '0 3px 0 #f87171',
                  '0 5px 12px rgba(239,68,68,0.2)',
                ].join(', '),
                color: '#EF4444',
              }}
            >
              Oops!
            </h1>

            <p className="text-xl font-bold text-[#1E293B] dark:text-[#FAFAFA] leading-snug">
              Access Denied
            </p>
          </motion.div>

          {/* Body text */}
          <motion.p variants={item} className="text-[#64748B] dark:text-[#A1A1AA] text-base leading-relaxed">
            This portal is exclusively for{' '}
            <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">CSE students and staff</span>{' '}
            of{' '}
            <span className="font-bold text-[#1E293B] dark:text-[#FAFAFA]">Saranathan College of Engineering</span>.
            Unauthorized accounts are not permitted.
          </motion.p>

          {/* Denied email display */}
          {deniedEmail && (
            <motion.div
              variants={item}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl',
                'bg-red-50 dark:bg-red-900/20 border-2 border-red-200/60 dark:border-red-800/40',
              )}
            >
              <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-0.5">Rejected Account</p>
                <p className="text-sm font-bold text-red-700 dark:text-red-400 break-all">{deniedEmail}</p>
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <motion.div variants={item} className="w-full border-t-2 border-dashed border-[#E2E4EC] dark:border-[#3F3F46]" />

          {/* What to use section */}
          <motion.div variants={item} className="w-full space-y-3">
            <p className="text-sm font-bold text-[#64748B] dark:text-[#A1A1AA] uppercase tracking-widest">Use your college account</p>

            {/* Pattern pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: 'cse*@saranathan.ac.in', desc: 'Students' },
                { label: 'punitha-cse@saranathan.ac.in', desc: 'HoD' },
              ].map(({ label, desc }) => (
                <div
                  key={label}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold',
                    'bg-[#4F46E5]/10 dark:bg-[#818CF8]/10 text-[#4F46E5] dark:text-[#818CF8]',
                  )}
                >
                  <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{label}</span>
                  <span className="opacity-60">({desc})</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={item} className="w-full flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <BendyButton className="w-full py-3.5 text-sm flex items-center justify-center gap-2">
                {/* Google logo */}
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Try a Different Account
              </BendyButton>
            </Link>

            <Link
              href="/"
              className={cn(
                'flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3.5 rounded-[18px] font-bold text-sm transition-all duration-200',
                'bg-[#EAEBEE] dark:bg-[#18181B] text-[#64748B] dark:text-[#A1A1AA]',
                'shadow-[0_2px_8px_rgba(160,172,201,0.25),inset_0_1px_rgba(255,255,255,0.8)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.05)]',
                'hover:text-[#4F46E5] dark:hover:text-[#818CF8]',
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.p
          variants={item}
          className="text-center text-xs text-[#94A3B8] dark:text-[#52525B] mt-5 leading-relaxed"
        >
          If you believe this is a mistake, contact your{' '}
          <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">CSE Department Admin</span>.
        </motion.p>
      </motion.div>
    </div>
  );
}
