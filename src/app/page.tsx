'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen, User as UserIcon } from "lucide-react";
import { CopyButton } from "./copy-button";
import { Skeleton } from '@/components/ui/skeleton';

function HomePageContent() {
  const { user, loading } = useUser();
  const router = useRouter();

  const createScript = `<div id="blogify-create-root"></div>
<script src="https://premium.blogify.blog/embed.js" defer></script>`;
  const [displayScript, setDisplayScript] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setDisplayScript(`<div class="blogify-posts-embed" data-author-id="${user.uid}"></div>
<script src="https://premium.blogify.blog/display.js" defer></script>`);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
         <div className="max-w-4xl w-full space-y-12">
            <header className="text-center space-y-4">
              <Skeleton className="h-14 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            </header>
            <main className="space-y-10">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                     <Code className="w-6 h-6 text-primary" />
                     <Skeleton className="h-7 w-64" />
                  </CardTitle>
                   <Skeleton className="h-4 w-full mt-2" />
                   <Skeleton className="h-4 w-3/4 mt-1" />
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary p-4 rounded-md font-code text-sm">
                     <Skeleton className="h-5 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                     <BookOpen className="w-6 h-6 text-primary" />
                      <Skeleton className="h-7 w-56" />
                  </CardTitle>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-3/4 mt-1" />
                </CardHeader>
                <CardContent>
                   <div className="bg-secondary p-4 rounded-md font-code text-sm">
                     <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            </main>
         </div>
       </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight">
            blogify<span className="text-primary font-bold">.blog</span> embed<span className="text-primary">&lt;&gt;</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Easily allow your users to post to blogify.blog directly from your website, and display their posts anywhere. Just copy and paste the code!
          </p>
        </header>

        <main className="space-y-10">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Code className="w-6 h-6 text-primary" />
                Embed the "Create Post" Button
              </CardTitle>
              <CardDescription>
                Copy the script tag below and paste it on your website where you want the "Post to blogify.blog" button to appear.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                <pre><code>{createScript}</code></pre>
                <CopyButton textToCopy={createScript} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <BookOpen className="w-6 h-6 text-primary" />
                Display Your Posts
              </CardTitle>
              <CardDescription>
                This snippet is generated specifically for your account. Paste it on your site where you want your posts to appear.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                <pre><code>{displayScript}</code></pre>
                <CopyButton textToCopy={displayScript} />
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
      <footer className="text-center text-muted-foreground text-sm py-8 mt-auto space-y-2">
        <div className="flex items-center justify-center gap-2">
          <UserIcon className="w-4 h-4" />
          <span>Logged in as: <strong>{user.email}</strong></span>
        </div>
        <p>
          © {new Date().getFullYear()} blogify.blog. All Rights Reserved.
        </p>
        <p>
          Powered by{' '}
          <a
            href="http://synctech.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            SYNC TECH Solutions
          </a>
        </p>
      </footer>
    </div>
  );
}


export default function Home() {
  return <HomePageContent />;
}
