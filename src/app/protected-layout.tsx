
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
    // If loading is finished, there's no user, and we are not on the login page,
    // then it's safe to redirect to the login page.
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  // While checking for the user, show a loader.
  // This prevents the redirect loop by waiting for a definitive auth state.
  if (loading) {
    return <FullPageLoader />;
  }

  // If loading is done and there's no user, we're in the process of redirecting,
  // so we continue showing the loader to prevent a flash of content.
  if (!user && pathname !== '/login') {
    return <FullPageLoader />;
  }

  // If there's a user, or if we are on the login page (which doesn't require auth),
  // show the actual content.
  return <>{children}</>;
}
