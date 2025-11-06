
"use client";

import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost, generatePost } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState, useRef } from "react";
import { Loader2, Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Link, List, Image as ImageIcon, Video, FileText, Table, Sparkles, HelpCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signInWithEmail } from "./auth-actions";
import type { User } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  "Sports",
  "Movies & TV",
  "Life",
  "Tech",
  "Fitness & Health",
] as const;

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(50),
  category: z.enum(categories),
  originUrl: z.string().url(),
  isPublished: z.boolean().default(false),
  metaDescription: z.string().min(1, "Meta description is required").max(160, "Meta description should be 160 characters or less."),
  featuredImageUrl: z.string().url("Featured image must be a valid URL.").min(1, "Featured image URL is required."),
  featuredImageAltText: z.string().min(1, "Featured image alt text is required.").max(125, "Alt text should be 125 characters or less."),
});

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const aiSchema = z.object({
    topic: z.string().min(3, "Please enter a topic for the AI to write about."),
});

type PostFormValues = z.infer<typeof postSchema>;
type AuthFormValues = z.infer<typeof authSchema>;
type AiFormValues = z.infer<typeof aiSchema>;

function AuthForm({ onAuthSuccess }: { onAuthSuccess: (user: User) => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await signInWithEmail(values.email, values.password);
      
      if (result.success && result.user) {
        toast({ title: "Success", description: "Signed in successfully." });
        onAuthSuccess(result.user as User);
      } else {
        throw new Error(result.error || "An unknown error occurred.");
      }
    } catch (error: any) {
       toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}

function EditorGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Editor Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Content Editor Guide</DialogTitle>
          <DialogDescription>
            Follow these instructions to create a well-formatted and SEO-friendly blog post.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-4 border rounded-md">
            <div className="space-y-6">
                <div>
                    <h4 className="text-primary font-semibold">Content Editor (Markdown)</h4>
                    <p>The content editor uses Markdown. Use the toolbar buttons for quick formatting. Your content will be automatically styled on the blog.</p>
                </div>
                
                <div>
                    <h4 className="text-primary font-semibold">Headings</h4>
                    <p>Use headings to structure your document. A single H1 is recommended for the main title (handled by the "Title" field), then H2 for main sections, H3 for sub-sections, etc.</p>
                    <div className="mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 space-y-1">
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs"># Heading 1 (Largest)</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">## Heading 2</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">### Heading 3</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">#### Heading 4</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">##### Heading 5</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">###### Heading 6 (Smallest)</p>
                    </div>
                </div>

                <div>
                    <h4 className="text-primary font-semibold">Text Formatting</h4>
                    <p>Emphasize text with bold or italics.</p>
                     <div className="mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 space-y-1">
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">This is **bold text**.</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">This is *italic text*.</p>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-primary font-semibold">Lists</h4>
                    <p>Use a dash for bulleted lists. Each item should be on a new line.</p>
                    <div className="mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 space-y-1">
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">- First item</p>
                        <p className="text-green-800 dark:text-green-300 font-mono text-xs">- Second item</p>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-primary font-semibold">Links and Media</h4>
                    <p>To add images, videos, or documents, first upload them to a file hosting service (like Google Drive, Dropbox, or Imgur) to get a public URL.</p>
                    <div className="mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 space-y-2">
                        <div>
                            <p className="font-medium text-sm">Regular Link:</p>
                            <p className="text-green-800 dark:text-green-300 font-mono text-xs">[Visit our website](https://example.com)</p>
                        </div>
                        <div>
                            <p className="font-medium text-sm">Image:</p>
                            <p className="text-green-800 dark:text-green-300 font-mono text-xs">![A description of the image](https://example.com/image.jpg)</p>
                        </div>
                        <div>
                            <p className="font-medium text-sm">Video or Document Link:</p>
                            <p className="text-green-800 dark:text-green-300 font-mono text-xs">[Watch the demo video](https://example.com/video.mp4)</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-primary font-semibold">Tables</h4>
                    <p>Use the table button to insert a basic Markdown table. You can add more rows and columns by following the pattern.</p>
                    <div className="mt-2 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                        <pre className="text-green-800 dark:text-green-300 font-mono text-xs">
{`| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`}
                        </pre>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-primary font-semibold">SEO & Metadata Fields</h4>
                    <p>These fields are critical for how your post appears on search engines and social media.</p>
                    <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                        <li><strong>Meta Description:</strong> A short (150-160 characters) summary of your post.</li>
                        <li><strong>Featured Image URL & Alt Text:</strong> Provide a URL to the main image for your post and a brief description for accessibility and SEO.</li>
                    </ul>
                </div>

                 <div>
                    <h4 className="text-primary font-semibold">Author Name</h4>
                    <p>The publicly displayed name of the post's author. You can change it to attribute the post to someone else.</p>
                </div>
            </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ContentEditor({ field, textareaRef }: { field: any, textareaRef: React.RefObject<HTMLTextAreaElement> }) {
  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = `${before}${selectedText}${after}`;
    
    const updatedValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    field.onChange(updatedValue);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = start + before.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition + selectedText.length);
    }, 0);
  };
  
  const insertLink = (type: 'image' | 'video' | 'document' | 'link') => {
    const url = prompt(`Enter ${type} URL:`);
    if (url) {
        let markdown;
        switch(type) {
            case 'image':
                markdown = `![Image](${url})`;
                break;
            case 'video':
                markdown = `[VIDEO LINK](${url})`;
                break;
            case 'document':
                markdown = `[DOCUMENT LINK](${url})`;
                break;
            case 'link':
                const linkText = prompt("Enter link text:", "link text");
                if (linkText) {
                    markdown = `[${linkText}](${url})`;
                }
                break;
        }
        if (markdown) {
            insertText(markdown);
        }
    }
  };


  return (
    <div className="space-y-2">
       <div className="flex items-center gap-1 flex-wrap p-2 border rounded-md bg-muted">
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("# ", "")}><Heading1 className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("## ", "")}><Heading2 className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("### ", "")}><Heading3 className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("#### ", "")}><Heading4 className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("##### ", "")}><Heading5 className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("###### ", "")}><Heading6 className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("**", "**")}><Bold className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("*", "*")}><Italic className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("\n- ", "")}><List className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertLink('link')}><Link className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertLink('image')}><ImageIcon className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertLink('video')}><Video className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertLink('document')}><FileText className="h-4 w-4" /></Button>
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n", "")}><Table className="h-4 w-4" /></Button>
       </div>
       <FormControl>
        <Textarea
          {...field}
          ref={textareaRef}
          className="min-h-[250px] resize-y"
          placeholder="Write your masterpiece here... (Markdown supported)"
        />
       </FormControl>
    </div>
  )
}

function AiWriterDialog({ onPostGenerated }: { onPostGenerated: (data: { title: string; content: string }) => void }) {
    const [open, setOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<AiFormValues>({
        resolver: zodResolver(aiSchema),
        defaultValues: { topic: "" },
    });

    const onSubmit = async (values: AiFormValues) => {
        setIsGenerating(true);
        const result = await generatePost(values.topic);
        setIsGenerating(false);

        if (result.error) {
            toast({ variant: "destructive", title: "AI Generation Failed", description: result.error });
        } else if (result.title && result.content) {
            onPostGenerated({ title: result.title, content: result.content });
            toast({ title: "Success", description: "AI has generated the post." });
            setOpen(false);
            form.reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Generate with AI
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Writing Assistant</DialogTitle>
                    <DialogDescription>
                        Describe the topic you want the AI to write a blog post about.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Topic</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., The future of renewable energy" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost" disabled={isGenerating}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isGenerating}>
                                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isGenerating ? "Generating..." : "Generate Post"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

function PostForm({ authorId, originUrl }: { authorId: string; originUrl: string }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorName: "",
      category: "Tech",
      originUrl: originUrl,
      isPublished: false,
      metaDescription: "",
      featuredImageUrl: "",
      featuredImageAltText: "",
    },
  });

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
            if (value) formData.append(key, 'on');
        } else {
            formData.append(key, value);
        }
    });
    formData.append('authorId', authorId);

    const result = await createPost(formData);
    
    if (result.success) {
      toast({
        title: "Success!",
        description: "Your post has been published.",
      });
      setTimeout(() => {
        window.parent.postMessage("blogify-post-success", "*");
      }, 1500);
    } else {
      toast({
        variant: "destructive",
        title: "Error publishing post",
        description: result.error || "An unknown error occurred.",
      });
    }
     setIsSubmitting(false);
  };
  
  const handleAiPostGenerated = (data: { title: string; content: string }) => {
    form.setValue("title", data.title);
    form.setValue("content", data.content);
  };

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="originUrl" render={({ field }) => (<FormItem><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>)} />
          
          <div className="flex justify-between items-center rounded-lg border p-3 shadow-sm">
             <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel>Publish</FormLabel>
                      <FormDescription className="text-xs">
                        Make this post public.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <AiWriterDialog onPostGenerated={handleAiPostGenerated} />
          </div>


          <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-headline">Title</FormLabel>
                <FormControl><Input placeholder="My Awesome Post" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField control={form.control} name="category" render={({ field }) => (
             <FormItem>
                <FormLabel className="font-headline">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
             </FormItem>
          )} />
          
          <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                 <div className="flex items-center justify-between">
                    <FormLabel className="font-headline">Content</FormLabel>
                    <EditorGuideDialog />
                 </div>
                <ContentEditor field={field} textareaRef={textareaRef} />
                <FormDescription>
                  You can use Markdown for formatting.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField control={form.control} name="authorName" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-headline">Author Name</FormLabel>
                <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">SEO & Metadata</CardTitle>
                <CardDescription>Optimize how your post appears on search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField control={form.control} name="metaDescription" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl><Textarea placeholder="A brief summary of your post (150-160 characters)..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 <FormField control={form.control} name="featuredImageUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 <FormField control={form.control} name="featuredImageAltText" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Featured Image Alt Text</FormLabel>
                        <FormControl><Input placeholder="A concise description of the image..." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90" size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </form>
      </Form>
  )
}

export default function CreatePostPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [originUrl, setOriginUrl] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const url = searchParams.get("originUrl");
    if (url) {
      try {
        const decodedUrl = decodeURIComponent(url);
        new URL(decodedUrl);
        setOriginUrl(decodedUrl);
      } catch (e) {
        console.error("Invalid originUrl passed in query string:", url);
        toast({
          variant: "destructive",
          title: "Error",
          description: "The originating website URL is invalid.",
        });
      }
    }
  }, [searchParams, toast]);

  if (!originUrl) {
    return (
      <main className="p-4 sm:p-6 flex items-center justify-center h-screen">
        <div className="text-center">
            <h2 className="text-xl font-semibold text-destructive">Invalid Origin</h2>
            <p className="text-muted-foreground mt-2">
                This page can only be embedded from a valid website.
            </p>
        </div>
      </main>
    )
  }

  return (
    <main className="p-4 sm:p-6">
      <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-center font-headline text-3xl">
             {user ? "Create a new post" : "Sign in to post to blogify.blog"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!user ? (
            <AuthForm onAuthSuccess={setUser} />
          ) : (
            <PostForm authorId={user.uid} originUrl={originUrl} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
