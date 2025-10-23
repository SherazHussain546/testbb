'use client';
import { useState, useEffect } from 'react';

import {
  onSnapshot,
  doc,
  type DocumentData,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';

import { useFirestore } from '../';

export function useDoc(path: string, docId: string) {
  const firestore = useFirestore() as Firestore;
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe: Unsubscribe = onSnapshot(
      doc(firestore, path, docId),
      (doc) => {
        setData(doc.data() as DocumentData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, docId]);

  return { data, loading };
}
