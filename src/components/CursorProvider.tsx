'use client'
import dynamic from 'next/dynamic';

// Wrap the ssr:false dynamic import inside a Client Component
// because next/dynamic with ssr:false is not allowed in Server Components
const CustomCursor = dynamic(
  () => import('@/components/ui/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false }
);

export function CursorProvider() {
  return <CustomCursor />;
}
