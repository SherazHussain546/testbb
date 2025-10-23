
"use server";

import { z } from "zod";
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
  
  try {
    // Simulate a successful post creation without a database.
    console.log("Simulating post creation with data:", validatedFields.data);
    
    // This will help in re-validating any pages that display blog posts, if you build them later.
    revalidatePath("/");
    
    // We can return a static ID or a randomly generated one for the simulation.
    return { success: true, postId: "simulated-post-id" };
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
