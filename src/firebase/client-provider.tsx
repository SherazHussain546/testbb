'use client';
import { useEffect, useState } from 'react';

import { FirebaseProvider } from './provider';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<any>(null);

  useEffect(() => {
    const { firebaseApp, auth, firestore } = initializeFirebase();
    setFirebase({ firebaseApp, auth, firestore });
  }, []);

  if (!firebase) {
    return null;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
