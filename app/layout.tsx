import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Press_Start_2P } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppTitle } from "@/components/app-title"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/react"
import { Twitter, Instagram, Globe } from "lucide-react"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
})

export const metadata: Metadata = {
  title: "Calculadora Granate",
  description: "Predice los partidos del Pontevedra CF y sus rivales en esta calculadora",
  openGraph: {
    title: "Calculadora Granate",
    description: "Predice los partidos del Pontevedra CF y sus rivales en esta calculadora",
  },
  twitter: {
    card: "summary",
    title: "Calculadora Granate",
    description: "Predice los partidos del Pontevedra CF y sus rivales en esta calculadora",
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${pixelFont.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-2M6058P5VT" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2M6058P5VT');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="container mx-auto py-8 px-4 min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <AppTitle />
              <ThemeToggle />
            </div>
            <main className="flex-grow">{children}</main>
            <footer className="mt-8 py-4 text-center text-sm text-muted-foreground border-t">
              <div className="flex flex-col items-center gap-3">
                <div>
                  Desarrollado por{" "}
                  <Link
                    href="http://twitter.com/manuls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold hover:text-primary transition-colors"
                  >
                    Manu Quiroga
                  </Link>{" "}
                  para{" "}
                  <Link
                    href="http://pontevedracf.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    PontevedraCF.Net
                  </Link>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <Link
                    href="http://twitter.com/pontevedracf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Twitter del Pontevedra CF"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="http://instagram.com/pontevedracfnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Instagram de PontevedraCF.Net"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://youtube.com/c/pontevedracfnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="YouTube de PontevedraCF.Net"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                      <path d="m10 15 5-3-5-3z" />
                    </svg>
                  </Link>
                  <Link
                    href="http://www.pontevedracf.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Web de PontevedraCF.Net"
                  >
                    <Globe className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}


import './globals.css'