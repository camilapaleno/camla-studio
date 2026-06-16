"use client"

import { ThemeProvider } from '@/context/ThemeContext';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <ThemeProvider>
      {!isHome && <Nav />}
      {children}
      {!isHome && <Footer />}
    </ThemeProvider>
  );
}
