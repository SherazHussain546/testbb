'use client';

import Script from 'next/script';

function CreatePostEmbed() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Testing Create Post Embed</h1>
      <div id="blogify-create-root"></div>
      <Script src="https://premium.blogify.blog/embed.js" defer />
    </div>
  );
}

function DisplayPostsEmbed() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Testing Display Posts Embed</h1>
      <div className="blogify-posts-embed" data-author-id="2aWGodgImAS3zspVpFF48yTqRJS2"></div>
      <Script src="https://premium.blogify.blog/display.js" defer />
    </div>
  );
}

export default function TestingPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-12">
      <CreatePostEmbed />
      <hr />
      <DisplayPostsEmbed />
    </div>
  );
}
