'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    // This just navigates to the homepage to test the flow.
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="w-full max-w-sm p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold">Log In</h1>
        <p className="text-muted-foreground">
          Click the button to proceed to the homepage.
        </p>
        <Button className="w-full" onClick={handleLoginClick}>
          Go to Homepage
        </Button>
      </div>
    </div>
  );
}
