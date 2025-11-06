
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

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
};

function PostCard({ post }: { post: Post }) {
    const publicationDate = post.publicationDate ? parseISO(post.publicationDate) : null;
    return (
        <Card>
            {post.featuredImageUrl && (
                <div className="relative aspect-[16/9] w-full">
                    <Image
                        src={post.featuredImageUrl}
                        alt={post.featuredImageAltText}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold mb-2">{post.title}</CardTitle>
                    <Badge variant="secondary">{post.category}</Badge>
                </div>
                 <CardDescription>
                    By {post.authorName}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* A real implementation might want to render markdown here */}
                <p className="text-muted-foreground line-clamp-3">
                    {post.content.substring(0, 200)}...
                </p>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
                <span>
                    Published on {publicationDate ? format(publicationDate, 'PPP') : 'N/A'}
                </span>
                <a href={post.originUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    View Original
                </a>
            </CardFooter>
        </Card>
    );
}

function PostSkeleton() {
    return (
        <Card>
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-20" />
                </div>
                 <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
                 <Skeleton className="h-4 w-1/3" />
            </CardFooter>
        </Card>
    )
}

export default function DisplayPostsPage() {
    const searchParams = useSearchParams();
    const authorId = searchParams.get('authorId');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (authorId) {
            setLoading(true);
            fetch(`/api/posts?authorId=${encodeURIComponent(authorId)}`)
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(err => { throw new Error(err.error || 'Failed to fetch posts') });
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.error) {
                      throw new Error(data.error);
                    }
                    setPosts(data);
                })
                .catch(err => {
                    console.error(err);
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setError('No author ID provided.');
            setLoading(false);
        }
    }, [authorId]);
    
    // Inform the parent window of content height changes
    useEffect(() => {
        if (containerRef.current) {
            const resizeObserver = new ResizeObserver(entries => {
                const height = entries[0].target.scrollHeight;
                window.parent.postMessage({ type: 'blogify-resize', height: height }, '*');
            });
            resizeObserver.observe(containerRef.current);
            return () => resizeObserver.disconnect();
        }
    }, [posts, loading, error]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-4">
                <p className="text-destructive">{error}</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="p-4 bg-transparent space-y-4">
            {loading ? (
                <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </>
            ) : posts.length === 0 ? (
                 <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">No posts found for this author.</p>
                </div>
            ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
            )}
        </div>
    );
}
