import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'] })

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Streakzzz",
  description: "Track your habits and build streaks!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

