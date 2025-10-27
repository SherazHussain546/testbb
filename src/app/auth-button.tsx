
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import { handleSignOut } from './auth-actions';
import { LogOut } from 'lucide-react';

export default function AuthButton() {
  const { user, loading } = useUser();

  const onSignOut = async () => {
    await handleSignOut();
    // Since there's no login page, we can just reload.
    window.location.reload();
  };

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

  return null;
}
