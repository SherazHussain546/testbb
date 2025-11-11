
import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

type Post = {
    id: string;
    title: string;
    content: string;
    authorName: string;
    category: string;
    publicationDate: string | null;
    originUrl: string;
    featuredImageUrl: string;
    featuredImageAltText: string;
    isPublished: boolean;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const authorId = searchParams.get('authorId');

  if (!authorId) {
    return NextResponse.json({ error: "authorId is required" }, { status: 400 });
  }

  try {
    const { firestore } = initializeFirebase();
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!appId) {
        throw new Error("Firebase App ID is not configured.");
    }
    // Note: This path uses a collectionGroup query, so we just use the collection ID.
    const collectionPath = `blog_posts`;
    
    const postsCollection = collection(firestore, collectionPath);

    // Simplified query: Only filter by author and order by date.
    // This avoids the need for a complex composite index.
    const q = query(
        postsCollection, 
        where("authorId", "==", authorId),
        orderBy("publicationDate", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts: Post[] = [];
    
    querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        
        // Manual filtering for isPublished happens here, in the application code.
        if (data.isPublished === true) {
            const publicationDate = data.publicationDate instanceof Timestamp 
                ? data.publicationDate.toDate().toISOString() 
                : null;
            
            const postData: Post = {
              id: doc.id,
              title: data.title || '',
              content: data.content || '',
              authorName: data.authorName || '',
              category: data.category || '',
              originUrl: data.originUrl || '',
              publicationDate: publicationDate,
              isPublished: data.isPublished,
              metaDescription: data.metaDescription || '',
              featuredImageUrl: data.featuredImageUrl || '',
              featuredImageAltText: data.featuredImageAltText || '',
            };
            posts.push(postData);
        }
    });

    return NextResponse.json(posts);

  } catch (error) {
    console.error("Error fetching posts:", error);
    let message = 'An unexpected error occurred while fetching posts.';
    if (error instanceof Error) {
        message = `Error: ${error.message}`;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
