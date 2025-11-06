
'use client';

import Script from 'next/script';

export default function TestingPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Testing Create Post Embed</h1>
      <div id="blogify-create-root"></div>
      <Script src="https://premium.blogify.blog/embed.js" defer />
    </div>
  );
}
