
'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '../auth-actions';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFormStatus } from 'react-dom';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
        </Button>
    )
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [state, formAction] = useActionState(signInWithEmail, {
    success: false,
  });

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Signed In',
        description: 'You have been successfully signed in.',
      });
      router.push('/');
      router.refresh();
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.error,
      });
    }
  }, [state, router, toast]);

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form action={formAction}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your blogify.blog account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register('password')} 
              />
               {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
