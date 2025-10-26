'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, BookOpen } from "lucide-react";
import { CopyButton } from "./copy-button";
import { Separator } from "@/components/ui/separator";

function HomePageContent() {
  const createScript = `<script src="https://premium.blogify.blog/embed.js" defer></script>`;
  const displayScript = `<div class="blogify-posts-embed" data-author-id="YOUR_AUTHOR_ID"></div>
<script src="https://premium.blogify.blog/display.js" defer></script>`;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tight">
            blogify<span className="text-primary font-bold">.blog</span> embed<span className="text-primary">&lt;&gt;</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Easily allow your users to post to blogify.blog directly from your website, and display their posts anywhere. Just copy and paste one line of code!
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
                Copy the script tag below and paste it just before the closing
                <code className="font-code mx-1 p-1 bg-muted rounded-sm">&lt;/body&gt;</code> tag on your website to add a "Post to blogify.blog" button.
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
                Display Author Posts
              </CardTitle>
              <CardDescription>
                Paste this snippet where you want to display the posts. Replace <code className="font-code mx-1 p-1 bg-muted rounded-sm">YOUR_AUTHOR_ID</code> with the actual ID of the author.
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
