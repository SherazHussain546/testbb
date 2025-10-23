
'use client';

export default function PostsPage() {

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

      <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Feature Disabled</h2>
          <p className="text-muted-foreground mt-2">
              This feature is currently not available as the database has been disconnected.
          </p>
      </div>
    </div>
  );
}
