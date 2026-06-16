import type { Metadata } from "next";
import '@/app/globals.css';
import { DM_Mono } from 'next/font/google';
import ClientLayout from '@/components/ClientLayout';

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
});

export const metadata: Metadata = {
  title: "Camila Paleno Web Development & Design",
  description: "Connecting web development with brand design. I work with web builders and Javascript frameworks for websites and Adobe CS, Lottie, and Blender for graphic creation to create a web site or application that tells your story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/tmt3ouk.css" />
      </head>
      <body className={dmMono.variable}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
