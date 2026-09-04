import Image from "next/image"
import Link from "next/link"

export function AppTitle() {
  return (
    <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Calculadora Granate, inicio">
      <Image src="/icon.svg" alt="" width={40} height={40} priority className="h-10 w-10 rounded-xl" />
      <div className="min-w-0 leading-tight">
        <span className="block truncate text-base font-semibold tracking-tight sm:text-lg">Calculadora Granate</span>
        <span className="block text-xs text-muted-foreground">Primera Federación · 2026/27</span>
      </div>
    </Link>
  )
}
