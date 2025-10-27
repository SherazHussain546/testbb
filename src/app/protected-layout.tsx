
'use client';

import { useUser } from '@/firebase/auth/use-user';
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
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    // Do not redirect if we are already on the login page or an embed page.
    if (!loading && !user && pathname !== '/login' && !pathname.startsWith('/embed')) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // Publicly accessible pages
  if (pathname === '/login' || pathname.startsWith('/embed')) {
    return <>{children}</>;
  }

  // While loading, show a loader to prevent race conditions
  if (loading) {
    return <FullPageLoader />;
  }

  // If there's a user, render the children
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (i.e., during the brief moment before redirect),
  // show a loader to prevent flashing content on a protected route.
  return <FullPageLoader />;
}
