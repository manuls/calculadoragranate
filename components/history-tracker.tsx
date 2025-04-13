"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { History, ArrowLeft, ArrowRight, Clock, RotateCcw } from "lucide-react"
import type { Team } from "@/lib/types"

interface HistoryEntry {
  id: string
  timestamp: Date
  teams: Team[]
  description: string
}

interface HistoryTrackerProps {
  currentTeams: Team[]
  onRestoreHistory: (teams: Team[]) => void
}

export default function HistoryTracker({ currentTeams, onRestoreHistory }: HistoryTrackerProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  // Cargar historial del localStorage al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("granate_history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        // Convertir las cadenas de fecha a objetos Date
        const historyWithDates = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
        setHistory(historyWithDates)
      } catch (e) {
        console.error("Error al cargar historial:", e)
      }
    }
  }, [])

  // Guardar historial en localStorage cuando cambie
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("granate_history", JSON.stringify(history))
    }
  }, [history])

  // Añadir entrada al historial
  const addHistoryEntry = (description: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      teams: JSON.parse(JSON.stringify(currentTeams)),
      description,
    }

    setHistory((prev) => {
      // Limitar el historial a 20 entradas
      const newHistory = [...prev, newEntry].slice(-20)
      return newHistory
    })
  }

  // Navegar por el historial
  const navigateHistory = (index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index)
      onRestoreHistory(history[index].teams)
    }
  }

  // Limpiar historial
  const clearHistory = () => {
    setHistory([])
    setCurrentIndex(null)
    localStorage.removeItem("granate_history")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">Historial</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historial de Cambios</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No hay entradas en el historial</p>
              <p className="text-sm mt-2">Cada vez que calcules la clasificación, se guardará automáticamente.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateHistory(currentIndex !== null ? currentIndex - 1 : history.length - 2)}
                  disabled={currentIndex === 0 || history.length < 2}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>

                <span className="text-sm text-muted-foreground">
                  {currentIndex !== null ? `${currentIndex + 1} de ${history.length}` : ""}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateHistory(currentIndex !== null ? currentIndex + 1 : 0)}
                  disabled={currentIndex === history.length - 1}
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {history.map((entry, index) => (
                  <Card
                    key={entry.id}
                    className={`relative cursor-pointer hover:bg-muted/50 transition-colors ${
                      index === currentIndex ? "border-primary" : ""
                    }`}
                    onClick={() => navigateHistory(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{entry.description}</h3>
                        <p className="text-xs text-muted-foreground">{entry.timestamp.toLocaleString()}</p>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Top 3:{" "}
                        {entry.teams
                          .slice(0, 3)
                          .map((t) => `${t.name} (${t.points}pts)`)
                          .join(", ")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-destructive hover:text-destructive"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpiar historial
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
