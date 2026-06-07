"use client";

import APCProvider from "@/context/APCContext";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <APCProvider>
      {children}
    </APCProvider>
  );
}
