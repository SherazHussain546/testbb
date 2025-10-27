
import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Image from 'next/image';
import AuthButton from './auth-button';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';


export const metadata: Metadata = {
  title: 'blogify.blog embed',
  description: 'Create and publish posts from anywhere on the web.',
};

function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="flex items-center gap-2">
                  <Image src="/bbrb.png" alt="blogify.blog logo" width={28} height={28} />
                  <span className="font-headline text-xl sm:text-2xl tracking-tighter">
                    <span className="font-bold">blogify</span><span className="text-primary font-bold">.blog</span>
                    <span className="text-base sm:text-lg ml-1">embed<span className="text-primary">&lt;&gt;</span></span>
                  </span>
              </Link>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button variant="ghost" asChild>
                <a href="https://blogify.blog" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Home className="h-4 w-4 sm:mr-2" /> 
                  <span className="hidden sm:inline">Home (blogify.blog)</span>
                </a>
              </Button>
              <AuthButton />
            </div>
        </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=Alegreya&display=swap" rel="stylesheet" />
        <script src="https://premium.blogify.blog/embed.js" defer></script>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
