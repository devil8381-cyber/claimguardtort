'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-admin'));
      window.location.replace('/');
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
    </div>
  );
}
