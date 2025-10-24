"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost } from "./actions";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState, useRef } from "react";
import { Loader2, Bold, Italic, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Link, List, Image as ImageIcon, Video, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signInWithEmail } from "./auth-actions";
import type { User } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";

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
});

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type PostFormValues = z.infer<typeof postSchema>;
type AuthFormValues = z.infer<typeof authSchema>;

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
         <Button size="sm" variant="outline" type="button" onClick={() => insertText("\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n", "")}>T</Button>
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
    },
  });

  const onSubmit = async (values: PostFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
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

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="originUrl" render={({ field }) => (<FormItem><FormControl><Input type="hidden" {...field} /></FormControl></FormItem>)} />
          
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
                <FormLabel className="font-headline">Content</FormLabel>
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

    