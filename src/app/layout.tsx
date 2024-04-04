import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navigation from "@/components/navigation/Navigation"
// import localFont from 'next/font/local'


const inter = Inter({ subsets: ["latin"], variable: '--font-inter'});

// const montserrat = localFont({
//   src: [
//     {
//       path: '../../public/fonts/Montserrat Arabic Light.otf',
//       weight: '300',
//       style: 'normal',
//     },
//     {
//       path: '../../public/fonts/Montserrat Arabic Medium.otf',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: '../../public/fonts/Montserrat Arabic SemiBold.otf',
//       weight: '600',
//       style: 'normal',
//     },
//     {
//       path: '../../public/fonts/Montserrat Arabic Bold.otf',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   display: 'block',
//   variable: '--font-montserrat',
// });

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
          <main className="container mx-auto max-w-7xl px-6 flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
