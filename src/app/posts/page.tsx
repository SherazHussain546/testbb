
'use client';

import { useState, useEffect } from 'react';
import { useCollection } from '@/firebase';
import { collection, orderBy, query, limit, type Query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirebase } from '@/firebase';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function PostsPage() {
  const { firestore } = useFirebase();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  const [postsQuery, setPostsQuery] = useState<Query | null>(null);

  useEffect(() => {
    if (firestore && appId) {
      const q = query(
        collection(firestore, `artifacts/${appId}/public/data/blog_posts`),
        orderBy('publicationDate', 'desc'),
        limit(20)
      );
      setPostsQuery(q);
    }
  }, [firestore, appId]);

  const { data: posts, loading, error } = useCollection(postsQuery);

  const showSkeletons = loading || !postsQuery;

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

      {showSkeletons && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
                <div className="mt-4">
                    <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-destructive/10">
          <h2 className="text-xl font-semibold text-destructive">Error Loading Posts</h2>
          <p className="text-muted-foreground mt-2">
            There was a problem fetching the latest posts. Please try again later.
          </p>
           <p className="text-xs text-muted-foreground mt-4">{error.message}</p>
        </div>
      )}

      {!showSkeletons && !error && posts && posts.length === 0 && (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No Posts Yet</h2>
            <p className="text-muted-foreground mt-2">
                It looks like no posts have been created. Try creating one from the{' '}
                <a href="/example" className="text-primary hover:underline">example page</a>!
            </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!showSkeletons && posts?.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
              <CardDescription>
                {post.publicationDate ? format(post.publicationDate.toDate(), 'PPP') : 'Date not available'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground line-clamp-4">{post.content}</p>
              <div className="text-sm text-muted-foreground mt-4">
                <p className="font-medium">{post.authorName}</p>
                <a href={post.originUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline truncate block">
                  From: {post.originUrl}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
