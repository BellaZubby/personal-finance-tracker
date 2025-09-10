'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';

const useRedirect= () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const rehydrated = useSelector((state: RootState) => state.auth.rehydrated);

  useEffect(() => {
    if (!rehydrated) return; // ✅ Wait until Redux is ready

     if (isAuthenticated) {
      router.replace("/"); // ✅ Redirect only if logged in
    }

  }, [isAuthenticated, router]);

};

export default useRedirect;