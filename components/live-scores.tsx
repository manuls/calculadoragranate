"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LiveMatch {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  minute: number
  status: "not_started" | "in_progress" | "halftime" | "finished"
  competition: string
}

export default function LiveScores() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const fetchLiveScores = async () => {
    setIsLoading(true)
    try {
      // En una implementación real, esto sería una llamada a una API externa
      // Por ahora, simulamos datos
      const mockData: LiveMatch[] = [
        {
          id: "1",
          homeTeam: "Pontevedra CF",
          awayTeam: "CD Numancia",
          homeScore: 2,
          awayScore: 1,
          minute: 75,
          status: "in_progress",
          competition: "Primera RFEF",
        },
        {
          id: "2",
          homeTeam: "Real Avila",
          awayTeam: "Real Aviles",
          homeScore: 0,
          awayScore: 0,
          minute: 32,
          status: "in_progress",
          competition: "Primera RFEF",
        },
        {
          id: "3",
          homeTeam: "Barcelona",
          awayTeam: "Real Madrid",
          homeScore: 1,
          awayScore: 2,
          minute: 65,
          status: "in_progress",
          competition: "La Liga",
        },
        {
          id: "4",
          homeTeam: "Atlético Madrid",
          awayTeam: "Sevilla",
          homeScore: 0,
          awayScore: 0,
          minute: 0,
          status: "not_started",
          competition: "La Liga",
        },
      ]

      setMatches(mockData)
    } catch (error) {
      console.error("Error al obtener resultados en vivo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveScores()

    // Actualizar cada minuto
    const interval = setInterval(fetchLiveScores, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusText = (status: LiveMatch["status"], minute: number) => {
    switch (status) {
      case "not_started":
        return "No comenzado"
      case "in_progress":
        return `${minute}'`
      case "halftime":
        return "Descanso"
      case "finished":
        return "Finalizado"
      default:
        return ""
    }
  }

  const filteredMatches = activeTab === "all" ? matches : matches.filter((match) => match.competition === activeTab)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Resultados en Vivo</CardTitle>
        <Button variant="ghost" size="sm" onClick={fetchLiveScores} disabled={isLoading} className="h-8 w-8 p-0">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Actualizar</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="Primera RFEF">Primera RFEF</TabsTrigger>
            <TabsTrigger value="La Liga">La Liga</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredMatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay partidos en vivo en este momento</div>
            ) : (
              <div className="space-y-3">
                {filteredMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div
                          className={`w-1 self-stretch ${
                            match.status === "in_progress"
                              ? "bg-green-500"
                              : match.status === "halftime"
                                ? "bg-yellow-500"
                                : match.status === "finished"
                                  ? "bg-gray-500"
                                  : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">{match.competition}</span>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getStatusText(match.status, match.minute)}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className={`font-medium ${match.homeTeam === "Pontevedra CF" ? "text-primary" : ""}`}>
                                {match.homeTeam}
                              </p>
                            </div>
                            <div className="px-4 text-xl font-bold">
                              {match.homeScore} - {match.awayScore}
                            </div>
                            <div className="flex-1 text-right">
                              <p className={`font-medium ${match.awayTeam === "Pontevedra CF" ? "text-primary" : ""}`}>
                                {match.awayTeam}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
