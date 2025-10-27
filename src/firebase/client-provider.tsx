
'use client';
import { useEffect, useState } from 'react';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import { Skeleton } from '@/components/ui/skeleton';

function FullPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </header>
        <main className="space-y-10">
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full mt-2" />
          </div>
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full mt-2" />
          </div>
        </main>
      </div>
    </div>
  );
}


export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<any>(null);

  useEffect(() => {
    try {
      const { firebaseApp, auth, firestore } = initializeFirebase();
      setFirebase({ firebaseApp, auth, firestore });
    } catch (e) {
      console.error("Firebase initialization error", e);
    }
  }, []);

  if (!firebase) {
    return <FullPageLoader />;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
