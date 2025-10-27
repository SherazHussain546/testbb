
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import { handleSignOut } from './auth-actions';
import { LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthButton() {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const onSignOut = async () => {
    await handleSignOut();
    router.push('/login');
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

  return (
    <Button asChild>
      <Link href="/login">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Link>
    </Button>
  );
}
