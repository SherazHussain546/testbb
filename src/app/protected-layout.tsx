
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const FullPageLoader = () => (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-7 w-40" />
            </div>
            <Skeleton className="h-9 w-20" />
        </div>
      </header>
       <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-6 md:p-8">
         <div className="max-w-4xl w-full space-y-12">
            <header className="text-center space-y-4">
              <Skeleton className="h-14 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            </header>
         </div>
       </div>
    </div>
);


export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // Don't protect the login page, otherwise we'd have an infinite redirect loop
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (loading) {
    return <FullPageLoader />;
  }

  if (!user) {
    // This case should be handled by the useEffect redirect, but as a fallback
    return <FullPagePageLoader />;
  }

  return <>{children}</>;
}
