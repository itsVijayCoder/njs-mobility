import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { LayoutWrapper } from "@/components/layout/layout-wrapper";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "NJS Mobility - Petrol Management System",
   description:
      "Modern petrol bulk management system with shift tracking, store sales, and comprehensive reporting",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang='en' suppressHydrationWarning>
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <AppProviders>
               <LayoutWrapper>{children}</LayoutWrapper>
            </AppProviders>
         </body>
      </html>
   );
}
