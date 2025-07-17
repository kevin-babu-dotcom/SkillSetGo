import "./styles/globals.css";
import { Outfit, Inter } from 'next/font/google'
import Navbar from "@/components/layout/Navbar";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit'
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata = {
  title: "SkillsetGo",
  description: "SkillsetGo - Your Path to Skill Mastery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}