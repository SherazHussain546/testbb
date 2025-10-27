
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen, User as UserIcon } from "lucide-react";
import { CopyButton } from "./copy-button";
import { useSiteUser } from "@/firebase/auth/use-site-user";
import { Skeleton } from "@/components/ui/skeleton";

function HomePageContent() {
    const { user, loading } = useSiteUser();

    const createScript = `<div id="blogify-create-root"></div>
<script src="https://premium.blogify.blog/embed.js" defer></script>`;

  // Dynamically create the display script with the user's ID
  const displayScript = `<div class="blogify-posts-embed" data-author-id="${user?.uid || 'YOUR_AUTHOR_ID_HERE'}"></div>
<script src="https://premium.blogify.blog/display.js" defer></script>`;

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
                Follow these steps to allow your users to create blog posts directly from your website.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Step 1: Copy the Code Snippet</h3>
                  <p className="text-muted-foreground mb-4">
                    Place the following code block anywhere in the HTML of your website where you want the creation form to appear. A common place is on a user's dashboard or a dedicated "New Post" page.
                  </p>
                  <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                    <pre><code>{createScript}</code></pre>
                    <CopyButton textToCopy={createScript} />
                  </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Step 2: How It Works</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>When you add this script to your site, it creates a secure area where your users can write and publish posts.</li>
                        <li>First-time users will be prompted to sign into their blogify.blog account. This is a one-time step to link their account to your site.</li>
                        <li>Once authenticated, they will see a rich text editor allowing them to write a title, content, select a category, and publish.</li>
                        <li>All posts are saved securely and associated with the user's unique Author ID.</li>
                    </ul>
                </div>
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
                {loading ? 'Loading your author ID...' : (user ? 'You are logged in! The snippet below is personalized with your unique Author ID. Paste it on your site where you want your posts to appear.' : 'Log in to get your personalized display script with your unique Author ID.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
               {user && (
                 <div className="mb-4 p-3 rounded-md border bg-accent/20 border-accent/50 text-sm">
                    <p className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-primary" />
                        <span className="font-medium">Your Author ID:</span>
                        <code className="font-mono text-primary font-bold">{user.uid}</code>
                    </p>
                 </div>
                )}
              <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                <pre><code>{displayScript}</code></pre>
                {loading && <Skeleton className="absolute inset-0 bg-muted/50" />}
                <CopyButton textToCopy={displayScript} />
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
      <footer className="text-center text-muted-foreground text-sm py-8 mt-auto space-y-2">
       {user && (
         <div className="flex items-center justify-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span>Logged in as: <strong>{user.email}</strong></span>
          </div>
        )}
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
  return (
      <HomePageContent />
  )
}
