"use client"

import { useState, useEffect } from "react"
import StandingsCalculator from "./standings-calculator"

export default function StandingsCalculatorClient() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <p>Cargando...</p>
  }

  return <StandingsCalculator />
}
