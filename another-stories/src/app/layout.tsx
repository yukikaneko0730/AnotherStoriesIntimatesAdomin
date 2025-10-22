// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { Playfair_Display, Manrope, Cormorant_Garamond } from "next/font/google"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" })
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" })
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-poetic" })

export const metadata: Metadata = {
  title: "Another Stories Intimates",
  description: "Close today’s story beautifully.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable} ${cormorant.variable}`}>
      <body className="bg-base text-neutral font-sans">
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  )
}
