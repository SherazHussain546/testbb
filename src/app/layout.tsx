
import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Script from 'next/script';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'blogify.blog embed',
  description: 'Create and publish posts from anywhere on the web.',
};

function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="flex items-center">
                <span className="font-headline text-2xl tracking-tighter">
                  <span className="font-bold">blogify</span><span className="text-primary font-bold">.blog</span>
                </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
            </nav>
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <script src="https://embedblogify.netlify.app/embed.js" defer></script>
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
