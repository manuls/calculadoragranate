"use client"

import dynamic from "next/dynamic"

const StandingsCalculatorClient = dynamic(() => import("@/components/standings-calculator-client"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function ClientPage() {
  return (
    <main className="container mx-auto py-8 px-4">
      <StandingsCalculatorClient />
    </main>
  )
}
