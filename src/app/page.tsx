
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";
import { CopyButton } from "./copy-button";
import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function HomePageContent() {
  const embedScript = `<script src="https://embedblogify.netlify.app/embed.js" defer></script>`;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight">
            blogify<span className="text-primary">.blog</span> embed<span className="text-primary">&lt;&gt;</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Easily allow your users to post to blogify.blog directly from your website. Just copy and paste one line of code!
          </p>
        </header>

        <main>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Code className="w-6 h-6 text-primary" />
                Get Your Embed Script
              </CardTitle>
              <CardDescription>
                Copy the script tag below and paste it just before the closing
                <code className="font-code mx-1 p-1 bg-muted rounded-sm">&lt;/body&gt;</code> tag on your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                <pre><code>{embedScript}</code></pre>
                <CopyButton textToCopy={embedScript} />
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Once added, a "Post to blogify.blog" button will appear on your site, allowing users to create posts in a pop-up modal.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      <footer className="text-center text-muted-foreground text-sm py-8 mt-auto space-y-2">
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
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl w-full space-y-8">
          <header className="text-center space-y-4">
             <Skeleton className="h-12 w-3/4 mx-auto" />
             <Skeleton className="h-6 w-1/2 mx-auto" />
          </header>
          <main>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4 mt-4" />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return <HomePageContent />;
}
