
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase"; // Using the configured firebase instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(50),
  originUrl: z.string().url("Invalid origin URL"),
});

type State = {
  errors?: {
    title?: string[];
    content?: string[];
    authorName?: string[];
    originUrl?: string[];
  };
  error?: string;
  success?: boolean;
  postId?: string;
}

export async function createPost(formData: FormData): Promise<State> {
  const rawFormData = {
    title: formData.get('title'),
    content: formData.get('content'),
    authorName: formData.get('authorName'),
    originUrl: formData.get('originUrl'),
  };

  const validatedFields = postSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  // The App ID from your environment variables is crucial for the Firestore path
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (!appId) {
    console.error("Firebase App ID is not configured in environment variables.");
    return {
      error: "Server configuration error: Firebase App ID is missing."
    };
  }

  try {
    // The collection path matches the structure in your backend.json
    const docRef = await addDoc(
      collection(db, `artifacts/${appId}/public/data/blog_posts`),
      {
        ...validatedFields.data,
        publicationDate: serverTimestamp(), // Using server timestamp for publication date
      }
    );
    
    // This will help in re-validating any pages that display blog posts, if you build them later.
    revalidatePath("/");
    
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error("Error creating post in Firestore:", error);
    let message = 'An unexpected error occurred while saving the post. Please try again.';
    if (error instanceof Error) {
        // You can add more specific checks for Firebase errors here if needed
        message = `Firestore error: ${error.message}`;
    }
    return {
      error: message
    };
  }
}
