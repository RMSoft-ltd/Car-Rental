"use client";

// This file is deprecated - auth is now handled by AuthContext
// Keeping this wrapper for compatibility during migration
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
