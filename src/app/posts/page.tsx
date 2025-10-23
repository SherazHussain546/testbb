
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  publicationDate: {
    seconds: number;
    nanoseconds: number;
  } | null;
  originUrl: string;
};

function BlogPostCard({ post }: { post: BlogPost }) {
  const publicationDate = post.publicationDate
    ? new Date(post.publicationDate.seconds * 1000)
    : null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>by {post.authorName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4 text-foreground/80">{post.content}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <a 
                href={post.originUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors flex items-center gap-1"
            >
                Posted from {new URL(post.originUrl).hostname}
                <ExternalLink className="h-3 w-3" />
            </a>
        </div>
        {publicationDate && (
          <p>
            {formatDistanceToNow(publicationDate, { addSuffix: true })}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}


export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
    if (!appId) {
      setError("Firebase App ID is not configured.");
      setIsLoading(false);
      return;
    }

    const postsCollectionPath = `artifacts/${appId}/public/data/blog_posts`;
    const q = query(collection(db, postsCollectionPath), orderBy("publicationDate", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as BlogPost));
      setPosts(postsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching posts: ", err);
      setError("Failed to fetch posts. Please check permissions.");
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <header className="text-center space-y-2 mb-8">
        <h1 className="text-4xl sm:text-5xl font-headline tracking-tight">
          Latest Posts
        </h1>
        <p className="text-lg text-muted-foreground">
          Content created from across the web.
        </p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Posts Yet</h2>
            <p className="text-muted-foreground mt-2">
                It looks like no one has published a post. Be the first!
            </p>
        </div>
      )}

      {error && (
        <div className="text-center py-16 border-2 border-dashed border-destructive rounded-lg">
            <h2 className="text-xl font-semibold text-destructive">An Error Occurred</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
