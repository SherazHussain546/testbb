
'use client';
import { useEffect, useState } from 'react';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';
import { initializeSiteAuth } from './site-auth-config';
import { Skeleton } from '@/components/ui/skeleton';

function FullPageLoader() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <p className="text-muted-foreground">Loading Application...</p>
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
      // Initialize the default firebase app for the embeds
      const { firebaseApp, auth, firestore } = initializeFirebase();
      
      // Initialize the named firebase app for site authentication
      initializeSiteAuth();

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
