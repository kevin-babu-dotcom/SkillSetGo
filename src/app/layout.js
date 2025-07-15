import "@app/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import { Inter, Outfit } from 'next/font/google'; // 1. Import the fonts

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // Create a CSS variable
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit', // Create a CSS variable
});
export const metadata = {
  title: "SkillsetGo",
  description: "SkillsetGo - Your Path to Skill Mastery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}  >
      <body className="font-sans">
        <Navbar />
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  )
}