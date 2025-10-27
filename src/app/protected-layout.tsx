'use client';

import { useSiteUser } from '@/firebase/auth/use-site-user';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

function FullPageLoader() {
  return (
    <div className="flex h-[calc(100vh-10rem)] w-full items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
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
    // If loading is finished and there's no user, redirect to login page.
    // We allow access to the login page itself to avoid a redirect loop.
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // While checking for the user, show a loader.
  // Also, don't run protection logic on the login page itself.
  if (loading && pathname !== '/login') {
    return <FullPageLoader />;
  }

  // If there's a user, or if we are on the login page, show the content.
  return <>{children}</>;
}
