"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JsonImportProps {
  importStandingsFromJson: (jsonString: string) => void
  importFixturesFromJson: (jsonString: string) => void
}

export default function JsonImport({ importStandingsFromJson, importFixturesFromJson }: JsonImportProps) {
  const [standingsJson, setStandingsJson] = useState("")
  const [fixturesJson, setFixturesJson] = useState("")

  const handleImportStandings = () => {
    importStandingsFromJson(standingsJson)
  }

  const handleImportFixtures = () => {
    importFixturesFromJson(fixturesJson)
  }

  // Ejemplos de JSON para ayudar al usuario
  const standingsExample = JSON.stringify(
    [
      { id: 1, name: "Equipo A", played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 22, goalsAgainst: 8, points: 23 },
      { id: 2, name: "Equipo B", played: 10, won: 6, drawn: 3, lost: 1, goalsFor: 18, goalsAgainst: 7, points: 21 },
    ],
    null,
    2,
  )

  const fixturesExample = JSON.stringify(
    [
      { id: 1, homeTeamId: 1, awayTeamId: 2 },
      { id: 2, homeTeamId: 3, awayTeamId: 4 },
    ],
    null,
    2,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Datos</CardTitle>
        <CardDescription>Importa la clasificación y los partidos pendientes desde JSON</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="standings">Clasificación</TabsTrigger>
            <TabsTrigger value="fixtures">Partidos</TabsTrigger>
          </TabsList>

          <TabsContent value="standings" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Formato de JSON para Clasificación</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">{standingsExample}</pre>
            </div>

            <div className="space-y-2">
              <label htmlFor="standings-json" className="text-sm font-medium">
                Pega tu JSON de clasificación aquí:
              </label>
              <Textarea
                id="standings-json"
                placeholder="[{ id: 1, name: 'Equipo A', ... }]"
                value={standingsJson}
                onChange={(e) => setStandingsJson(e.target.value)}
                rows={10}
              />
            </div>

            <Button onClick={handleImportStandings}>Importar Clasificación</Button>
          </TabsContent>

          <TabsContent value="fixtures" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Formato de JSON para Partidos</h3>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">{fixturesExample}</pre>
            </div>

            <div className="space-y-2">
              <label htmlFor="fixtures-json" className="text-sm font-medium">
                Pega tu JSON de partidos aquí:
              </label>
              <Textarea
                id="fixtures-json"
                placeholder="[{ id: 1, homeTeamId: 1, awayTeamId: 2 }]"
                value={fixturesJson}
                onChange={(e) => setFixturesJson(e.target.value)}
                rows={10}
              />
            </div>

            <Button onClick={handleImportFixtures}>Importar Partidos</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

