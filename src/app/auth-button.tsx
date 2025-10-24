
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from './auth-actions';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

export function AuthButton() {
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return <Button variant="ghost" disabled><Loader2 className="h-4 w-4 animate-spin" /></Button>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
            {user.email}
        </span>
        <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </div>
  );
}
