
'use client';

import { useSiteUser } from '@/firebase/auth/use-site-user';
import { Button } from '@/components/ui/button';
import { handleSignOut } from './auth-actions';
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthButton() {
  const { user, loading } = useSiteUser();
  const router = useRouter();
  const pathname = usePathname();

  const onSignOut = async () => {
    const result = await handleSignOut();
    if (result.success) {
        router.push('/login');
        router.refresh();
    }
  };

  // Don't render the auth button on the login page
  if (pathname === '/login') {
    return null;
  }

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />;
  }

  if (user) {
    return (
      <Button variant="ghost" onClick={onSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  // If not loading and no user, show the sign-in button,
  // but only if not on an embed page.
  if (!pathname.startsWith('/embed')) {
    return (
      <Button asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    );
  }

  return null;
}
