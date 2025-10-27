
'use client';

import { useSiteUser } from '@/firebase/auth/use-site-user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function FullPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </header>
        <main className="space-y-10">
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full mt-2" />
          </div>
          <div className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-full mt-2" />
          </div>
        </main>
      </div>
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
    // If we're done loading and there's no user, redirect to login.
    // We explicitly exclude the login page and embed pages from this check.
    if (!loading && !user && pathname !== '/login' && !pathname.startsWith('/embed')) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // Publicly accessible pages that don't need protection or loading screens.
  if (pathname === '/login' || pathname.startsWith('/embed')) {
    return <>{children}</>;
  }

  // For all other pages, if we are still checking the auth state, show a loader.
  if (loading) {
    return <FullPageLoader />;
  }

  // If we have finished loading and there is a user, render the protected content.
  if (user) {
    return <>{children}</>;
  }

  // If we are not loading and there's no user, we are about to redirect.
  // Showing a loader here prevents a flash of unstyled or incorrect content.
  return <FullPageLoader />;
}
