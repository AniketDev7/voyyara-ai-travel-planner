import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "AI Travel Planner - Plan Your Perfect Trip with AI",
  description: "Get personalized travel itineraries in seconds with our AI-powered travel planner. Create detailed, day-by-day plans tailored to your preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`} suppressHydrationWarning>
        <Header />
        <main className="pt-16 min-h-screen overflow-x-hidden">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
