
import Script from 'next/script';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

export default function ExamplePage() {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <article className="space-y-6">
          <header className="space-y-2">
            <p className="text-sm text-muted-foreground">Published on {new Date().toLocaleDateString()}</p>
            <h1 className="text-4xl font-bold tracking-tight font-headline">A Journey into the Unknown</h1>
            <div className="flex items-center gap-4 pt-2">
              <Avatar>
                <AvatarImage src="https://picsum.photos/seed/author/40/40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Jane Doe</p>
                <p className="text-sm text-muted-foreground">Explorer & Writer</p>
              </div>
            </div>
          </header>
          
          <Image 
            src="https://picsum.photos/seed/journey/800/400" 
            alt="A scenic landscape representing a journey"
            width={800}
            height={400}
            className="rounded-lg shadow-lg w-full aspect-video object-cover"
            data-ai-hint="journey landscape"
          />

          <div className="prose prose-lg max-w-none text-foreground/90 font-body">
            <p>
              This page is a live demonstration of the Blogify embed script. Notice the "Post to blogify.blog" button 
              at the bottom-right corner of your screen. That button was added by the single line of code you see
              on the homepage.
            </p>
            <p>
              Go ahead and click it! A modal will appear, allowing you to create a new blog post without ever leaving this page. 
              Once you publish it, your post will appear on the "Blog Posts" page of this site.
            </p>
            <p>
              This showcases how you can empower your users to contribute to `blogify.blog` directly from your own website, 
              creating a seamless and integrated experience. It's a simple yet powerful way to build a community and generate content.
            </p>
          </div>
        </article>
      </div>

      {/* The magic script that adds the embeddable button and modal functionality */}
      <Script src="https://embedblogify.netlify.app/embed.js" defer />
    </>
  );
}
