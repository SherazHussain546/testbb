
import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Blogify Embedder',
  description: 'Create and publish posts from anywhere on the web.',
};

function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="font-headline text-2xl font-bold tracking-tighter">
                blogify.blog
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/">Home</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/posts">Posts</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link href="/example">Example</Link>
                </Button>
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
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya&display=swap" rel="stylesheet" />
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
