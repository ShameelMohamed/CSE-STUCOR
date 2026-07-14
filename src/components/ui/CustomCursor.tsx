'use client'
import { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const hoverable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      setIsHovering(hoverable);
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    // RAF loop for buttery smooth movement
    const animate = () => {
      if (cursor) {
        cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-2px, -2px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', move);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <style suppressHydrationWarning>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <div
        ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        // Clay bubble arrow cursor
        opacity: isVisible ? 1 : 0,
        willChange: 'transform',
      }}
    >
      <svg
        width={isHovering ? "40" : "32"}
        height={isHovering ? "40" : "32"}
        viewBox="0 0 24 24"
        style={{
          transition: 'width 0.2s cubic-bezier(0.34,1.56,0.64,1), height 0.2s cubic-bezier(0.34,1.56,0.64,1), transform 0.2s ease',
          transform: isClicking ? 'scale(0.85)' : 'scale(1)',
          transformOrigin: 'top left',
          filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.15)) drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      >
        <defs>
          <linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <filter id="clayInset">
            <feOffset dx="-1" dy="-1" />
            <feGaussianBlur stdDeviation="1" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.05" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>
        <path 
          d="M2 2 L18 8 L10 10 L7 18 Z" 
          fill="url(#clayGrad)" 
          className="stroke-black dark:stroke-white"
          strokeWidth="1.5" 
          strokeLinejoin="round" 
          strokeLinecap="round"
          filter="url(#clayInset)"
        />
      </svg>
    </div>
    </>
  );
};
