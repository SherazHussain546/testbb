
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
                  <h3 className="font-semibold text-lg mb-2">Step 1: How to Add the Snippet</h3>
                  <p className="text-muted-foreground mb-4">
                    Copy the following code block and paste it into the HTML of your website.
                  </p>
                  <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                    <pre><code>{createScript}</code></pre>
                    <CopyButton textToCopy={createScript} />
                  </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Step 2: Where to Use It</h3>
                    <p className="text-muted-foreground mb-4">
                        **Recommendation:** This script will render a complete post creation form inside an iframe. It is designed for authenticated users who are part of your community. Please add this code snippet to a secure page that is not visible to the general public, such as a user dashboard, profile page, or a dedicated "New Post" area after they have logged into your website.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Step 3: What Will Happen and How to Access It</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Once you add the snippet, a "**Post to blogify.blog**" button will appear on your page.</li>
                        <li>When a user on your site clicks this button, a secure iframe will open, displaying the blogify.blog posting form.</li>
                        <li>**First-Time Use**: The first time a user clicks the button, they will be asked to sign into their blogify.blog account. This is a one-time security step to link their account to your website, ensuring they are a valid author.</li>
                        <li>**Creating a Post**: After authenticating, they will see a rich text editor where they can write a title, add content using Markdown, select a category, and publish their post.</li>
                        <li>All posts are saved securely to their blogify.blog account and are associated with their **unique Author ID**.</li>
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
                {loading ? 'Loading your author ID...' : (user ? 'You are logged in! The snippet below is personalized with your unique Author ID.' : 'Log in to get your personalized display script.')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Step 1: How to Get Your Author ID</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>To display posts, the script needs to know whose posts to show. This is done using your **unique Author ID**.</li>
                    <li>You will receive your **unique Author ID** from the service provider when you sign up.</li>
                     <li>If you are not logged in, please sign in to get your personalized snippet.</li>
                  </ul>
                  {user && (
                    <div className="mt-4 p-3 rounded-md border bg-accent/20 border-accent/50 text-sm">
                        <p className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-primary" />
                            <span className="font-medium">Your **Author ID**:</span>
                            <code className="font-mono text-primary font-bold">{user.uid}</code>
                        </p>
                    </div>
                  )}
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Step 2: How to Add the Snippet</h3>
                     <p className="text-muted-foreground mb-4">
                        Copy the code snippet below. You will need to **replace 'YOUR_AUTHOR_ID_HERE'** with the **unique Author ID** you receive from your provider.
                    </p>
                    <div className="bg-secondary p-4 rounded-md font-code text-sm overflow-x-auto relative group">
                        <pre><code>{displayScript}</code></pre>
                        {loading && <Skeleton className="absolute inset-0 bg-muted/50" />}
                        <CopyButton textToCopy={displayScript} />
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2">Step 3: Where to Use It & What Will Happen</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Paste this snippet into the HTML of any page where you want to display your posts, such as your personal blog, company website, or portfolio.</li>
                        <li>The script will **automatically fetch all of your published posts from blogify.blog** and display them as a clean, responsive list of cards.</li>
                        <li>The containing `div` will automatically resize to fit the content, preventing empty space on your page.</li>
                    </ul>
                </div>
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

    

    