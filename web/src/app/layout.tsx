'use client'

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/common";
import GlobalProviders from "@/components/providers/GlobalProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider defaultOpen>
          <div className="flex h-full w-full max-w-full overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col max-h-screen w-full">
              {/* <AppHeader /> */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6 lg:py-4">
                <GlobalProviders>
                  {children}
                </GlobalProviders>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
