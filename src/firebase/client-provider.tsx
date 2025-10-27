'use client';
import { useEffect, useState } from 'react';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import { Skeleton } from '@/components/ui/skeleton';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const { firebaseApp, auth, firestore } = initializeFirebase();
      setFirebase({ firebaseApp, auth, firestore });
    } catch (e) {
      console.error("Firebase initialization error", e);
    } finally {
        setLoading(false);
    }
  }, []);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl w-full space-y-12">
                <header className="text-center space-y-4">
                    <Skeleton className="h-14 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
                </header>
            </div>
        </div>
    );
  }

  if (!firebase) {
    // Optionally handle the case where Firebase fails to initialize
    return <div className="flex items-center justify-center h-screen">Could not connect to Firebase.</div>;
  }


  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
