
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create a new post',
  robots: 'noindex, nofollow',
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      {children}
    </div>
  );
}
