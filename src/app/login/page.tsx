
'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/app/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const initialState = {
  success: false,
  error: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {pending ? 'Signing In...' : 'Sign In'}
        </Button>
    )
}


export default function LoginPage() {
  const [state, formAction] = useFormState(signInWithEmail, initialState);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Sign In Successful',
        description: 'Redirecting to the homepage...',
      });
      // Redirect to the homepage on successful login
      router.push('/');
      router.refresh(); // ensures the page is refreshed with the new auth state
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: state.error,
      });
    }
  }, [state, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-sm p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-muted-foreground">Access your account</p>
        </div>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
