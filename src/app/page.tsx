
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Eye } from "lucide-react";
import { CopyButton } from "./copy-button";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function Home() {
  const embedScript = `<script src="https://embedblogify.netlify.app/embed.js" defer></script>`;
  const embedUrl = "/embed/create";

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
              <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
                <p className="text-sm text-muted-foreground flex-1">
                  Once added, a "Post to blogify.blog" button will appear on your site, allowing users to create posts in a pop-up modal.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Eye className="mr-2 h-4 w-4" /> Live Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
                    <DialogHeader className="p-6 pb-0">
                      <DialogTitle>Live Embed Preview</DialogTitle>
                      <DialogDescription>
                        This is how the blog post creation form will appear inside a modal on your website.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 p-6 pt-0">
                      <iframe 
                        src={embedUrl}
                        className="w-full h-full border rounded-md"
                        title="Live Preview"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
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
