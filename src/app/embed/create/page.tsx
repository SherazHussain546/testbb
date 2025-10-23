
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

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(50),
  originUrl: z.string().url(), // This will be hidden but is required
});

type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePostPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originUrl, setOriginUrl] = useState("");

  useEffect(() => {
    const url = searchParams.get("originUrl");
    if (url) {
      try {
        // Basic validation to ensure it's a plausible URL
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

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorName: "",
      originUrl: "",
    },
  });

  // Set the hidden originUrl field value when it's determined from the query params
  useEffect(() => {
    if (originUrl) {
      form.setValue("originUrl", originUrl);
    }
  }, [originUrl, form]);


  const onSubmit = async (values: PostFormValues) => {
    if (!originUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot publish post without a valid origin website.",
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    // Append all form values, including the hidden originUrl
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await createPost(formData);
    
    if (result.success) {
      toast({
        title: "Success!",
        description: "Your post has been published.",
      });
      // Send a message to the parent window (the website with the embed) to close the modal
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
    <main className="p-4 sm:p-6">
      <Card className="w-full max-w-2xl mx-auto border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-center font-headline text-3xl">Post to blogify.blog</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* This hidden field is crucial for security and tracking */}
              <FormField
                control={form.control}
                name="originUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Post" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Once upon a time..."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline">Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting || !originUrl} className="w-full bg-accent hover:bg-accent/90" size="lg">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
