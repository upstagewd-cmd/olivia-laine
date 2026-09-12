import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata = {
  title: "Olivia Laine — Stylist for Film & Commercials",
  description: "Wardrobe styling for commercials and branded film.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans">
          <div className="relative h-screen w-screen overflow-hidden">
            <Suspense fallback={null}>
              <Sidebar />
            </Suspense>
            <main className="flex h-full w-full flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}