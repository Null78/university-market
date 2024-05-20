import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navigation from "@/components/navigation/Navigation"
import 'filepond/dist/filepond.min.css'


const inter = Inter({ subsets: ["latin"], variable: '--font-inter'});

export const metadata: Metadata = {
  title: "UPM Market",
  description: "UPM Market is a platform for UPM students to buy and sell items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-inter light text-foreground bg-background`}>
      <body>
        <Providers>
          <Navigation />
          <main className="container mx-auto max-w-5xl px-6 flex-grow mt-6 h-[calc(100vh-125.5px)]">
            {children}
          </main>
          <div className="footer text-center mx-auto pb-4">
            <p className="text-sm text-gray-600 text-center">© 2024 University Market. All rights reserved.</p>
          </div>
        </Providers>
      </body>
    </html>
  );
}
