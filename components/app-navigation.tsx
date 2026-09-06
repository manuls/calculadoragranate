"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
export function AppNavigation() {
  const pathname = usePathname()
  return <nav aria-label="Secciones de Calculadora Granate" className="mx-auto flex w-full max-w-[1480px] gap-5 px-4 md:px-6">{[{ href: "/", label: "Calculadora" }, { href: "/pronosticos", label: "Pronósticos" }].map(({href, label}) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
    return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`border-b-2 py-3 text-sm font-medium ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{label}</Link>
  })}</nav>
}
