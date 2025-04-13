import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavbarWrapper from "../components/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart QA Assistant",
  description: "Inteligentný asistent pre každodenné otázky",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='sk'>
      <body className={inter.className}>
        <Providers>
          <NavbarWrapper />
          <div>
            {/* The Navbar will be included on all pages */}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
