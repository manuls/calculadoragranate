"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const StandingsCalculator = dynamic(() => import("./standings-calculator"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function ClientPage() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <p>Cargando...</p>
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <StandingsCalculator />
    </main>
  )
}
