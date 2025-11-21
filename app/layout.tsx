import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { MSWProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "BookHub - Your Ultimate Book Destination",
  description: "Discover, buy, and manage your favorite books with BookHub",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} bg-black text-white min-h-screen`}
      >
        <MSWProvider>
          <AuthProvider>
            <Suspense
              fallback={
                <div className="bg-black text-white min-h-screen flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              {children}
            </Suspense>
          </AuthProvider>
        </MSWProvider>

        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
