import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Providers } from "./provider"; // we make use of the provider component, this wraps all pages in the Redux provider via the <Providers> component
import AuthInitializer from "./components/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Akulyst",
    template: "%s | Akulyst",
  },
  description:
    "Track your expenses, set goals, and grow your wealth with Akulyst.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthInitializer />
          <Navbar />
          {/* children is the content of each route (e.g., /signup, /dashboard), anything within the page.tsx */}
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
