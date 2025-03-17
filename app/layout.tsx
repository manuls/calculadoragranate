import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import Script from "next/script"
import Link from "next/link"
import { Twitter, Instagram, Globe } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Calculadora Granate",
  description: "Calcula y predice los resultados de la liga de fútbol",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
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
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-primary">Calculadora Granate</h1>
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 rounded-md">
                  BETA
                </span>
              </div>
              <ThemeToggle />
            </div>
            <main className="flex-grow">{children}</main>
            <footer className="mt-8 py-6 text-center text-sm text-muted-foreground border-t">
              <div className="flex flex-col items-center gap-4">
                <div>
                  Desarrollado por{" "}
                  <Link
                    href="http://twitter.com/manuls"
                    target="_blank"
                    className="font-bold hover:text-primary transition-colors"
                  >
                    Manu Quiroga
                  </Link>{" "}
                  de{" "}
                  <Link href="http://pontevedracf.net" target="_blank" className="hover:text-primary transition-colors">
                    PontevedraCF.Net
                  </Link>
                </div>
                <div className="flex justify-center gap-4">
                  <Link
                    href="http://twitter.com/pontevedracf"
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 transition-colors"
                    aria-label="Twitter/X"
                  >
                    <Twitter size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                  <Link
                    href="http://instagram.com/pontevedracfnet"
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                  <Link
                    href="http://www.pontevedracf.net"
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-primary/10 transition-colors"
                    aria-label="Sitio web"
                  >
                    <Globe size={18} className="text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'