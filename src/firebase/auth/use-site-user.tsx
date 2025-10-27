
'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getSiteAuth } from '../site-auth-config';

export function useSiteUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    try {
        const siteAuth = getSiteAuth();
        setAuth(siteAuth);
    } catch(e) {
        // This can happen on first render if the site auth app isn't initialized yet.
        // It will be re-attempted on the next render.
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      // If auth is not initialized, we can't check the user.
      // Set loading to false if we couldn't get it.
      if(!loading) setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return {
    user,
    loading,
  };
}
