
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function FullPageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <Skeleton className="h-14 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </header>
        <main className="space-y-10">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-8 w-full" />
            </div>
             <div className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-8 w-full" />
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

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While loading, show a loader
  if (loading) {
    return <FullPageLoader />;
  }

  // If there's a user, render the children
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (i.e., during the brief moment before redirect),
  // show a loader to prevent flashing content.
  return <FullPageLoader />;
}
