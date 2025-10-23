
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required").max(50),
});

type State = {
  errors?: {
    title?: string[];
    content?: string[];
    authorName?: string[];
  };
  error?: string;
  success?: boolean;
  postId?: string;
}

export async function createPost(formData: FormData): Promise<State> {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = postSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (!appId) {
    console.error("Firebase App ID is not configured.");
    return {
      error: "Server configuration error. Unable to save post."
    };
  }

  try {
    const docRef = await addDoc(
      collection(db, `artifacts/${appId}/public/data/blog_posts`),
      {
        ...validatedFields.data,
        createdAt: serverTimestamp(),
      }
    );
    
    revalidatePath("/");
    
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error("Error creating post:", error);
    let message = 'An unexpected error occurred. Please try again.';
    if (error instanceof Error) {
        // Potentially check for specific Firebase errors here
        message = error.message;
    }
    return {
      error: message
    };
  }
}
