'use client';

import { useSiteUser } from '@/firebase/auth/use-site-user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function FullPageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <p className="text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSiteUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    // Exclude the login page and embed pages from protection.
    if (!loading && !user && pathname !== '/login' && !pathname.startsWith('/embed')) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // These pages are public and don't need protection.
  if (pathname === '/login' || pathname.startsWith('/embed')) {
    return <>{children}</>;
  }

  // While checking the user's auth status, show a loader.
  if (loading) {
    return <FullPageLoader />;
  }

  // If loading is complete and we have a user, show the requested page.
  if (user) {
    return <>{children}</>;
  }

  // If not loading and no user, the redirect is in progress.
  // Show the loader to prevent a flash of incorrect content.
  return <FullPageLoader />;
}
