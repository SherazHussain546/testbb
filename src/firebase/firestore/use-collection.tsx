'use client';
import { useState, useEffect } from 'react';

import {
  onSnapshot,
  type DocumentData,
  type Query,
  type Unsubscribe,
} from 'firebase/firestore';

export function useCollection(query: Query | null) {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe: Unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err: Error) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
