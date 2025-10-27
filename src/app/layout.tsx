
import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Image from 'next/image';
import AuthButton from './auth-button';
import ProtectedLayout from './protected-layout';


export const metadata: Metadata = {
  title: 'blogify.blog embed',
  description: 'Create and publish posts from anywhere on the web.',
};

function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/bbrb.png" alt="blogify.blog logo" width={28} height={28} />
                <span className="font-headline text-2xl tracking-tighter">
                  <span className="font-bold">blogify</span><span className="text-primary font-bold">.blog</span>
                </span>
            </Link>
            <AuthButton />
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
          <ProtectedLayout>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
          </ProtectedLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
