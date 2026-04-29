"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

import { SessionProvider } from "next-auth/react";
import { ReactLenis } from 'lenis/react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <ReactLenis root options={{ lerp: 0.08, wheelMultiplier: 1, smoothWheel: true }}>
      <SessionProvider>
        {!isLoginPage && <Navbar />}
        <main className="flex-1">
          {children}
        </main>
      </SessionProvider>
    </ReactLenis>
  );
}
