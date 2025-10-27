
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
       <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold">Log In</h1>
            <p className="text-muted-foreground">Click the button to proceed.</p>
        </div>
        <Button onClick={handleLoginClick} className="w-full">
            Log In
        </Button>
       </div>
    </div>
  );
}
