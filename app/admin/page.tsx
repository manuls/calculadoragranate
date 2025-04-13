"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { LockIcon, Save, RefreshCw, AlertTriangle, Download, Upload } from "lucide-react"
import type { Match, Team, MatchdayUpdate } from "@/lib/types"
import { fetchOfficialResults, submitOfficialResults } from "@/lib/api"
import { initialTeams, initialFixtures } from "@/lib/data"
import HistoricalDataImport from "@/components/historical-data-import"

// Clave para localStorage
const STORAGE_KEY = "official_results_data"

export default function AdminPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [fixtures, setFixtures] = useState<Match[]>(initialFixtures)
  const [activeMatchday, setActiveMatchday] = useState("27")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("results")
  const { toast } = useToast()

  // Cargar datos oficiales al iniciar
  useEffect(() => {
    const loadOfficialResults = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log("Admin: Cargando resultados oficiales...")

        // Intentar cargar desde la API
        const response = await fetchOfficialResults()

        // Si la API falla, intentar cargar desde localStorage
        if (!response.success || !response.data) {
          const localData = localStorage.getItem(STORAGE_KEY)
          if (localData) {
            try {
              const parsedData = JSON.parse(localData)
              applyOfficialResults(parsedData)
              toast({
                title: "Datos cargados localmente",
                description: "Se cargaron los datos desde el almacenamiento local",
              })
              setIsLoading(false)
              return
            } catch (e) {
              console.error("Error al parsear datos locales:", e)
            }
          }

          if (response.error) {
            setError(response.error)
            toast({
              title: "Error",
              description: response.error,
              variant: "destructive",
            })
          }
        } else {
          // Aplicar los resultados oficiales desde la API
          applyOfficialResults(response.data)
          console.log("Admin: Datos aplicados desde API")
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        console.error("Error al cargar resultados oficiales:", error)
        setError(errorMessage)
        toast({
          title: "Error",
          description: "No se pudieron cargar los resultados oficiales: " + errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOfficialResults()
  }, [toast])

  // Función para aplicar los resultados oficiales a los fixtures
  const applyOfficialResults = (data: any) => {
    if (!data || !data.matchdays) return

    const updatedFixtures = [...initialFixtures]

    // Para cada jornada en los datos oficiales
    data.matchdays.forEach((matchdayData: MatchdayUpdate) => {
      // Para cada partido en la jornada
      matchdayData.matches.forEach((officialMatch) => {
        // Encontrar el partido correspondiente en los fixtures
        const matchIndex = updatedFixtures.findIndex((m) => m.id === officialMatch.id)
        if (matchIndex >= 0) {
          updatedFixtures[matchIndex] = {
            ...updatedFixtures[matchIndex],
            result: officialMatch.result,
            locked: officialMatch.locked,
          }
        }
      })
    })

    setFixtures(updatedFixtures)
  }

  // Agrupar partidos por jornada
  const matchdayGroups = fixtures.reduce(
    (groups, match) => {
      const matchday = match.matchday.toString()
      if (!groups[matchday]) {
        groups[matchday] = []
      }
      groups[matchday].push(match)
      return groups
    },
    {} as Record<string, Match[]>,
  )

  // Obtener el nombre del equipo por ID
  const getTeamName = (teamId: number) => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Equipo desconocido"
  }

  // Actualizar resultado de un partido
  const updateMatchResult = (matchId: number, field: "homeGoals" | "awayGoals", value: string) => {
    const numValue = Number.parseInt(value)
    if (isNaN(numValue) || numValue < 0) return

    setFixtures((prev) =>
      prev.map((match) => {
        if (match.id === matchId) {
          return {
            ...match,
            result: {
              ...(match.result || { homeGoals: 0, awayGoals: 0, isOfficial: true }),
              [field]: numValue,
            },
          }
        }
        return match
      }),
    )
  }

  // Actualizar estado de bloqueo de un partido
  const toggleMatchLock = (matchId: number) => {
    setFixtures((prev) =>
      prev.map((match) => {
        if (match.id === matchId) {
          // Si no hay resultado, no permitir bloquear
          if (!match.result && !match.locked) return match

          return {
            ...match,
            locked: !match.locked,
            result: match.result
              ? {
                  ...match.result,
                  isOfficial: !match.locked,
                }
              : null,
          }
        }
        return match
      }),
    )
  }

  // Guardar resultados oficiales
  const saveOfficialResults = async () => {
    setIsSaving(true)
    setError(null)

    try {
      console.log("Admin: Guardando resultados oficiales...")

      // Obtener los partidos de la jornada activa
      const matchdayMatches = fixtures.filter((match) => match.matchday.toString() === activeMatchday)

      // Filtrar solo los partidos bloqueados con resultados
      const lockedMatches = matchdayMatches
        .filter((match) => match.locked && match.result)
        .map((match) => ({
          id: match.id,
          result: {
            homeGoals: match.result!.homeGoals,
            awayGoals: match.result!.awayGoals,
            isOfficial: true,
          },
          locked: true,
        }))

      // Verificar si hay partidos para guardar
      if (lockedMatches.length === 0) {
        toast({
          title: "Advertencia",
          description: "No hay partidos bloqueados para guardar en esta jornada",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Crear objeto con los datos a enviar
      const matchdayData: MatchdayUpdate = {
        matchday: Number.parseInt(activeMatchday),
        matches: lockedMatches,
      }

      console.log("Admin: Enviando datos a la API:", matchdayData)

      // Intentar guardar en la API
      const response = await submitOfficialResults(matchdayData)

      console.log("Admin: Respuesta de la API:", response)

      // Guardar también en localStorage como respaldo
      try {
        // Obtener datos actuales de localStorage
        const localDataStr = localStorage.getItem(STORAGE_KEY)
        let localData = { matchdays: [] }

        if (localDataStr) {
          localData = JSON.parse(localDataStr)
        }

        // Actualizar o añadir la jornada
        const matchdayIndex = localData.matchdays.findIndex((m: any) => m.matchday === matchdayData.matchday)

        if (matchdayIndex >= 0) {
          localData.matchdays[matchdayIndex] = matchdayData
        } else {
          localData.matchdays.push(matchdayData)
        }

        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localData))
        console.log("Admin: Datos guardados en localStorage")
      } catch (localError) {
        console.error("Error al guardar en localStorage:", localError)
      }

      if (response.success) {
        toast({
          title: "Guardado exitoso",
          description: `Se han guardado los resultados oficiales de la jornada ${activeMatchday}`,
        })

        // Añadir un pequeño retraso antes de recargar para que el usuario vea el mensaje
        setTimeout(() => {
          // Recargar la página para aplicar los cambios
          window.location.reload()
        }, 1500)
      } else {
        // Si la API falla pero guardamos en localStorage, mostrar mensaje mixto
        toast({
          title: "Guardado parcial",
          description: `Los datos se guardaron localmente, pero hubo un error en el servidor: ${response.error}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      console.error("Error al guardar resultados:", error)
      setError(errorMessage)
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados oficiales: " + errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Exportar datos a JSON
  const exportData = () => {
    try {
      // Crear objeto con todos los resultados oficiales
      const exportData = { matchdays: [] }

      // Agrupar por jornada
      const matchdayMap = new Map<number, any[]>()

      fixtures.forEach((match) => {
        if (match.locked && match.result) {
          if (!matchdayMap.has(match.matchday)) {
            matchdayMap.set(match.matchday, [])
          }

          matchdayMap.get(match.matchday)!.push({
            id: match.id,
            result: {
              homeGoals: match.result.homeGoals,
              awayGoals: match.result.awayGoals,
              isOfficial: true,
            },
            locked: true,
          })
        }
      })

      // Convertir el mapa a array de jornadas
      matchdayMap.forEach((matches, matchday) => {
        exportData.matchdays.push({
          matchday,
          matches,
        })
      })

      // Crear y descargar el archivo
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const a = document.createElement("a")
      a.href = url
      a.download = "official-results.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Exportación exitosa",
        description: "Los datos se han exportado correctamente",
      })
    } catch (error) {
      console.error("Error al exportar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    }
  }

  // Importar datos desde JSON
  const importData = () => {
    try {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "application/json"

      input.onchange = (e: any) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target!.result as string)

            if (!data.matchdays) {
              throw new Error("Formato de archivo inválido")
            }

            // Aplicar los datos importados
            applyOfficialResults(data)

            // Guardar en localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

            toast({
              title: "Importación exitosa",
              description: "Los datos se han importado correctamente",
            })
          } catch (parseError) {
            console.error("Error al parsear el archivo:", parseError)
            toast({
              title: "Error",
              description: "El archivo no tiene un formato válido",
              variant: "destructive",
            })
          }
        }

        reader.readAsText(file)
      }

      input.click()
    } catch (error) {
      console.error("Error al importar datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron importar los datos",
        variant: "destructive",
      })
    }
  }

  // Ordenar las jornadas numéricamente
  const sortedMatchdays = Object.keys(matchdayGroups).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p>Cargando datos oficiales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full mb-8">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center justify-between">
            <span>Panel de Administración</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary-foreground"
                onClick={exportData}
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 text-primary-foreground"
                onClick={importData}
              >
                <Upload className="h-4 w-4 mr-1" />
                Importar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="results">Resultados Oficiales</TabsTrigger>
              <TabsTrigger value="historical">Datos Históricos</TabsTrigger>
            </TabsList>

            <TabsContent value="results">
              {error && (
                <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md flex items-center text-red-800 dark:text-red-300">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Tabs value={activeMatchday} onValueChange={setActiveMatchday} className="w-full">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Seleccionar Jornada</h2>
                  <div className="overflow-x-auto pb-2">
                    <TabsList className="inline-flex flex-wrap whitespace-nowrap">
                      {sortedMatchdays.map((matchday) => {
                        const lockedCount = matchdayGroups[matchday].filter((m) => m.locked).length

                        // Determinar la clase de estilo basada en si hay partidos bloqueados
                        let tabClass = "tab-inactive data-[state=active]:tab-active"

                        if (lockedCount > 0) {
                          // Si hay partidos bloqueados, usar un fondo azul
                          tabClass += " bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60"
                        }

                        return (
                          <TabsTrigger key={matchday} value={matchday} className={tabClass}>
                            Jornada {matchday}
                          </TabsTrigger>
                        )
                      })}
                    </TabsList>
                  </div>
                </div>

                {sortedMatchdays.map((matchday) => (
                  <TabsContent key={matchday} value={matchday} className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Jornada {matchday}</h3>
                      <Button onClick={saveOfficialResults} disabled={isSaving} className="bg-primary">
                        {isSaving ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Resultados Oficiales
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {matchdayGroups[matchday].map((match) => (
                        <Card key={match.id} className={match.locked ? "border-blue-500" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="w-1/3 text-right font-medium">{getTeamName(match.homeTeamId)}</div>

                              <div className="flex items-center space-x-4 w-1/3 justify-center">
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-16 text-center"
                                  value={match.result?.homeGoals ?? ""}
                                  onChange={(e) => updateMatchResult(match.id, "homeGoals", e.target.value)}
                                />
                                <span>-</span>
                                <Input
                                  type="number"
                                  min="0"
                                  className="w-16 text-center"
                                  value={match.result?.awayGoals ?? ""}
                                  onChange={(e) => updateMatchResult(match.id, "awayGoals", e.target.value)}
                                />

                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`lock-${match.id}`}
                                    checked={match.locked || false}
                                    onCheckedChange={() => toggleMatchLock(match.id)}
                                    className={match.locked ? "bg-blue-500 text-white" : ""}
                                  />
                                  <Label htmlFor={`lock-${match.id}`} className="cursor-pointer">
                                    <LockIcon
                                      className={`h-4 w-4 ${match.locked ? "text-blue-500" : "text-gray-400"}`}
                                    />
                                  </Label>
                                </div>
                              </div>

                              <div className="w-1/3 text-left font-medium">{getTeamName(match.awayTeamId)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent value="historical">
              <HistoricalDataImport fixtures={fixtures} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
