import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "ECHFLUX | Skills-First Matching",
  description: "Intelligent skill-to-need matching engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn("font-sans dark", geist.variable)}>
        <body className="min-h-screen bg-background antialiased selection:bg-primary/30">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
