import { ClerkProvider } from "@clerk/nextjs";
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
          <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar />
            <main className="flex flex-1 flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
