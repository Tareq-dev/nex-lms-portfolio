import type { Metadata } from "next";
import type { ReactNode } from "react";

// @ts-expect-error CSS is handled by Next.js and has no TypeScript declarations.
import "./globals.css";

import ReduxProvider from "@/redux/providers/ReduxProvider";
import ThemeProvider from "@/redux/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "NEX-LMS",
  description: "Professional Learning Management System",
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}