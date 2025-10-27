
'use client';

import { useSiteUser } from '@/firebase/auth/use-site-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSiteUser();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading, show a loading screen
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-muted-foreground">Loading...</p>
        </div>
    );
  }

  // If there is a user, show the children
  if (user) {
    return <>{children}</>;
  }

  // This will be shown briefly before the redirect happens
  return (
    <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Redirecting to login...</p>
    </div>
    );
}
