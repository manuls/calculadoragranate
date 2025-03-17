"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import StandingsCalculator from "./standings-calculator"

export default function StandingsCalculatorClient() {
  const [isClient, setIsClient] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <p>{t("loading")}</p>
  }

  return <StandingsCalculator />
}

