# **App Name**: Blogify Embedder

## Core Features:

- Embeddable Script Generation: Generates a javascript script which hosts a button that other websites can include to allow their users to create and publish posts directly to blogify.blog. The embed.js script injects an iframe into the host webpage that points to the post creation form.
- Dedicated Embed Page: Creates a dedicated page in Next.js (src/app/embed/create/page.tsx) with a form for creating a new blog post (Title, Content, Author Name, etc.), styled for embedding using ShadCN.
- Form Submission Logic: Implements form submission using a Next.js Server Action to save the new blog post to the Firestore collection.
- Cross-Window Communication: Handles cross-window communication using window.parent.postMessage() to send a 'success' message back to the host page, triggered after a successful blog post creation.

## Style Guidelines:

- Primary color: Soft purple (#A084CA) to evoke creativity and sophistication.
- Background color: Light gray (#F0F0F0) to ensure the form stands out within any host page.
- Accent color: Teal (#77B6BA) for interactive elements like buttons and links.
- Headline font: 'Belleza', sans-serif, aligned to fashion, art, and design; if longer text is anticipated, choose 'Alegreya' for body text.
- Minimalist layout to fit seamlessly within different websites, optimized for iframe display.
- Subtle fade-in animation when the iframe appears on the host website.