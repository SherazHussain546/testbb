
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";
import { CopyButton } from "./copy-button";

export default function Home() {
  const embedScript = `<script src="http://localhost:9002/embed.js" defer></script>`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline tracking-tight">
            Blogify Embedder
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Easily allow your users to post to Blogify directly from your website. Just copy and paste one line of code!
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
              <p className="mt-4 text-sm text-muted-foreground">
                Once added, a "Post to blogify.blog" button will appear on your site, allowing users to create posts in a pop-up modal. In a production environment, you would replace `http://localhost:9002` with your actual domain.
              </p>
            </CardContent>
          </Card>
        </main>

        <footer className="text-center text-muted-foreground text-sm pt-8">
          <p>&copy; {new Date().getFullYear()} Blogify.blog. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
