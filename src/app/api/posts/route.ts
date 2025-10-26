
import { NextRequest, NextResponse } from "next/server";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

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
    const collectionPath = `artifacts/${appId}/public/data/blog_posts`;
    
    const postsCollection = collection(firestore, collectionPath);
    const q = query(
        postsCollection, 
        where("authorId", "==", authorId),
        where("isPublished", "==", true),
        orderBy("publicationDate", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to a serializable format (ISO string)
            publicationDate: data.publicationDate?.toDate ? data.publicationDate.toDate().toISOString() : null,
        };
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
