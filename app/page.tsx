import StandingsCalculator from "@/components/standings-calculator"

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[1480px] px-3 py-4 sm:px-4 md:px-6 md:py-6">
      <StandingsCalculator />
    </main>
  )
}
