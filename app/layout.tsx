import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import RootProvider from "@/components/providers/RootProvider";
import { logEnvCheck } from "@/lib/config/envCheck";

export const metadata: Metadata = {
  title: "APC Master Control Center",
  description:
    "Saving Lives and Building Stronger Communities through Safety and Connections.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await headers();
  logEnvCheck();

  return (
    <html lang="en">
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
