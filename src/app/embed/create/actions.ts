
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { generatePost as generatePostFlow } from "@/ai/flows/generate-post-flow";


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
  authorId: z.string().min(1, "Author ID is required"),
  originUrl: z.string().url("Invalid origin URL"),
  isPublished: z.preprocess((val) => val === 'on', z.boolean()).optional().default(false),
  metaDescription: z.string().min(1, "Meta description is required").max(160, "Meta description should be 160 characters or less."),
  featuredImageUrl: z.string().url("Featured image must be a valid URL.").min(1, "Featured image URL is required."),
  featuredImageAltText: z.string().min(1, "Featured image alt text is required.").max(125, "Alt text should be 125 characters or less."),
});

type State = {
  errors?: {
    title?: string[];
    content?: string[];
    authorName?: string[];
    category?: string[];
    authorId?: string[];
    originUrl?: string[];
    isPublished?: string[];
    metaDescription?: string[];
    featuredImageUrl?: string[];
    featuredImageAltText?: string[];
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
    category: formData.get('category'),
    authorId: formData.get('authorId'),
    originUrl: formData.get('originUrl'),
    isPublished: formData.get('isPublished'),
    metaDescription: formData.get('metaDescription'),
    featuredImageUrl: formData.get('featuredImageUrl'),
    featuredImageAltText: formData.get('featuredImageAltText'),
  };

  const validatedFields = postSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { firestore } = initializeFirebase();

    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!appId) {
        throw new Error("Firebase App ID is not configured.");
    }
    const collectionPath = `artifacts/${appId}/public/data/blog_posts`;
    
    const docRef = await addDoc(collection(firestore, collectionPath), {
      ...validatedFields.data,
      publicationDate: serverTimestamp(),
    });
    
    // This path won't exist in this new structure, but keeping it
    // doesn't harm anything. A better approach would be to have the parent
    // window listen for the success message and refresh itself.
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

const generatePostSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

type GeneratePostState = {
    title?: string;
    content?: string;
    error?: string;
}

export async function generatePost(topic: string): Promise<GeneratePostState> {
    const validatedFields = generatePostSchema.safeParse({ topic });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors.topic?.join(', '),
        };
    }

    try {
        const result = await generatePostFlow({ topic: validatedFields.data.topic });
        return {
            title: result.title,
            content: result.content,
        };
    } catch (error) {
        console.error("Error generating post:", error);
        return {
            error: "Failed to generate post using AI. Please try again.",
        };
    }
}
