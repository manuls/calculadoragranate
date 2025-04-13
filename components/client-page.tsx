"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

const StandingsCalculator = dynamic(() => import("./standings-calculator"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function ClientPage() {
  const [isClient, setIsClient] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <p>{t("loading")}</p>
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <StandingsCalculator />
    </main>
  )
}
