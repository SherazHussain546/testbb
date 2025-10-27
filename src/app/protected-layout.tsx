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

  // While checking for the user, show a loader. This is the most crucial part.
  // We will not attempt any redirects until `loading` is false.
  if (loading) {
    return <FullPageLoader />;
  }

  // If loading is complete, and we are not on the login page, and there is no user,
  // then it's safe to redirect to the login page.
  if (!user && pathname !== '/login') {
    router.push('/login');
    // Return a loader while the redirect happens.
    return <FullPageLoader />;
  }

  // If there's a user, or if we are on the login page, show the content.
  return <>{children}</>;
}
