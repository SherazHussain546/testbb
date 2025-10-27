'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useActionState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmail } from '../auth-actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, { success: false });
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (state.success) {
      router.push('/');
    }
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.error,
      });
    }
  }, [state, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your embed snippets.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
