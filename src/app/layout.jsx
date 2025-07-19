import "./globals.css";
import { Outfit, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Initialize both fonts
const InterSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const OutfitMono = Outfit({
  variable: "--font-outfit-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SkillsetGo",
  description: "SkillsetGo - Find the Career that fits you perfectly.",
};

export default function RootLayout({ children }) {
  return (
    // Ensure BOTH variables are included in the className here
    <html lang="en" className={`${InterSans.variable} ${OutfitMono.variable} antialiased`}>
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}