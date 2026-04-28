"use client"

import { ThemeProvider } from '@/context/ThemeContext';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Nav />
      {children}
      <Footer />
    </ThemeProvider>
  );
}
