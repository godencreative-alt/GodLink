import { Suspense } from 'react';
import { VerifyContent } from '@/components/auth/verify-content';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-background">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}