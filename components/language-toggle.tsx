"use client"

import { useRouter, usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "gl" : "es"
    router.push(pathname.replace(`/${locale}`, `/${newLocale}`))
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="bg-background dark:bg-secondary">
      {locale === "es" ? "GL" : "ES"}
    </Button>
  )
}
