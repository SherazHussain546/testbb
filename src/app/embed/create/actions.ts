
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

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
  
  try {
    // Initialize Firebase and get Auth and Firestore instances
    const { firestore, auth } = initializeFirebase();

    // Sign in anonymously to get a UID for the authorId
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    if (!user) {
        throw new Error("Could not authenticate user anonymously.");
    }

    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!appId) {
        throw new Error("Firebase App ID is not configured.");
    }
    const collectionPath = `artifacts/${appId}/public/data/blog_posts`;
    
    // Add the authorId from the anonymous user to the post data
    const docRef = await addDoc(collection(firestore, collectionPath), {
      ...validatedFields.data,
      authorId: user.uid, // This is required by your security rules
      publicationDate: serverTimestamp(),
    });
    
    revalidatePath("/posts");
    
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error("Error creating post:", error);
    let message = 'An unexpected error occurred while saving the post. Please try again.';
    if (error instanceof Error) {
        message = `Error: ${error.message}`;
    }
    return {
      error: message
    };
  }
}
