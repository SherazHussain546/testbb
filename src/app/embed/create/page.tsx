
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmail, signUpWithEmail } from "./auth-actions";
import type { User } from "firebase/auth";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(50),
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
  const [activeTab, setActiveTab] = useState("signin");

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      let result;
      if (activeTab === 'signin') {
        result = await signInWithEmail(values.email, values.password);
      } else {
        result = await signUpWithEmail(values.email, values.password);
      }

      if (result.success && result.user) {
        toast({ title: "Success", description: activeTab === 'signin' ? "Signed in successfully." : "Account created successfully." });
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
    <Tabs defaultValue="signin" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
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
      </TabsContent>
      <TabsContent value="signup">
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
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  )
}


function PostForm({ authorId, originUrl }: { authorId: string; originUrl: string }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorName: "",
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
      setIsSubmitting(false);
    }
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
          <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel className="font-headline">Content</FormLabel>
                <FormControl><Textarea placeholder="Once upon a time..." className="min-h-[150px] resize-y" {...field} /></FormControl>
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
             {user ? "Create a new post" : "Post to blogify.blog"}
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
