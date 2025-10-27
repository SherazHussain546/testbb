'use client';

// This is a temporary bypass for debugging navigation.
// The original protected layout will be restored later.
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
