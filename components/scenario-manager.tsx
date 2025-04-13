"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Save, Trash2, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Team, Match } from "@/lib/types"

interface Scenario {
  id: string
  name: string
  teams: Team[]
  fixtures: Match[]
  tempResults: Record<number, { home: string; away: string }>
  createdAt: Date
}

interface ScenarioManagerProps {
  currentTeams: Team[]
  currentFixtures: Match[]
  currentTempResults: Record<number, { home: string; away: string }>
  loadScenario: (scenario: Scenario) => void
}

export default function ScenarioManager({
  currentTeams,
  currentFixtures,
  currentTempResults,
  loadScenario,
}: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [newScenarioName, setNewScenarioName] = useState("")
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])

  // Cargar escenarios guardados
  useEffect(() => {
    const savedScenarios = localStorage.getItem("granate_scenarios")
    if (savedScenarios) {
      try {
        setScenarios(JSON.parse(savedScenarios))
      } catch (e) {
        console.error("Error al cargar escenarios:", e)
      }
    }
  }, [])

  // Guardar escenarios cuando cambien
  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem("granate_scenarios", JSON.stringify(scenarios))
    }
  }, [scenarios])

  const saveCurrentScenario = () => {
    if (!newScenarioName.trim()) return

    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: newScenarioName,
      teams: JSON.parse(JSON.stringify(currentTeams)),
      fixtures: JSON.parse(JSON.stringify(currentFixtures)),
      tempResults: JSON.parse(JSON.stringify(currentTempResults)),
      createdAt: new Date(),
    }

    setScenarios((prev) => [...prev, newScenario])
    setNewScenarioName("")
  }

  const deleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
    setSelectedScenarios((prev) => prev.filter((s) => s !== id))
  }

  const toggleScenarioSelection = (id: string) => {
    setSelectedScenarios((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Escenarios</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gestor de Escenarios</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nombre del escenario"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
            />
            <Button onClick={saveCurrentScenario} disabled={!newScenarioName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>

          {scenarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay escenarios guardados</div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="relative">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{scenario.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Creado: {new Date(scenario.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => loadScenario(scenario)}>
                        Cargar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteScenario(scenario.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
